import logger from '../config/logger.js';
import User from '../models/user.model.js';
import Branch from '../models/branch.model.js';
import BarberProfile from '../models/barberProfile.model.js';
import Service from '../models/service.model.js';
import Chair from '../models/chair.model.js';
import Appointment from '../models/appointment.model.js';
import Payment from '../models/payment.model.js';
import Queue from '../models/queue.model.js';
import AuditLog from '../models/auditLog.model.js';
import {
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  QUEUE_STATUS,
} from '../constant.js';

// Demo data is idempotent: every step looks up its natural key first, so this can
// be run repeatedly against an existing database without duplicating or wiping.

const SERVICE_FIXTURES = [
  {
    name: 'Haircut',
    description: 'Classic haircut',
    duration: 30,
    price: 500,
    chairTypeRequired: 'hair',
    category: 'Hair',
  },
  {
    name: 'Beard Trim',
    description: 'Professional beard trimming',
    duration: 20,
    price: 300,
    chairTypeRequired: 'shave',
    category: 'Grooming',
  },
  {
    name: 'Hair Color',
    description: 'Full hair coloring service',
    duration: 90,
    price: 1500,
    deposit: 500,
    isDepositRefundable: false,
    chairTypeRequired: 'hair',
    category: 'Color',
  },
  {
    name: 'Shave',
    description: 'Traditional hot towel shave',
    duration: 40,
    price: 600,
    chairTypeRequired: 'shave',
    category: 'Grooming',
  },
  {
    name: 'Manicure',
    description: 'Professional nail care',
    duration: 45,
    price: 800,
    chairTypeRequired: 'nail',
    category: 'Nails',
  },
];

// Times are relative to "now" so dashboards always show today's activity.
const at = (dayOffset, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const inHours = (hours) => {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return date;
};

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

const ensureUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) return existing;
  // Plain password on purpose: the User pre-save hook hashes it once.
  return new User(data).save();
};

const ensureBranch = async (data) => {
  const existing = await Branch.findOne({ code: data.code });
  if (existing) return existing;
  return new Branch(data).save();
};

const ensureChairs = async (branch, count) => {
  const existing = await Chair.countDocuments({ branchId: branch._id });
  if (existing > 0) return Chair.find({ branchId: branch._id }).sort({ number: 1 });

  const chairs = [];
  for (let i = 1; i <= count; i += 1) {
    chairs.push({
      branchId: branch._id,
      name: `Chair ${i}`,
      number: i,
      type: i <= count - 2 ? 'hair' : i === count - 1 ? 'shave' : 'nail',
      isOperational: true,
      isShared: true,
    });
  }
  await Chair.insertMany(chairs);
  return Chair.find({ branchId: branch._id }).sort({ number: 1 });
};

const ensureServices = async (branch) => {
  for (const fixture of SERVICE_FIXTURES) {
    const existing = await Service.findOne({ name: fixture.name });
    if (existing) {
      await Service.updateOne(
        { _id: existing._id },
        { $addToSet: { branchIds: branch._id } },
      );
    } else {
      await Service.create({
        ...fixture,
        deposit: fixture.deposit || 0,
        isDepositRefundable: fixture.isDepositRefundable ?? true,
        branchIds: [branch._id],
        isActive: true,
      });
    }
  }
  return Service.find({ name: { $in: SERVICE_FIXTURES.map((s) => s.name) } });
};

const ensureBarber = async ({ user, branch, branches, services }) => {
  const existing = await BarberProfile.findOne({ userId: user._id });
  if (existing) return existing;

  return BarberProfile.create({
    userId: user._id,
    branchId: branch._id,
    branches: branches.map((b) => b._id),
    specialties: services.map((s) => s._id),
    workingHours: {
      start: '09:00',
      end: '21:00',
      breaks: [{ start: '13:00', end: '14:00' }],
    },
    isActive: true,
    qualification: 'Licensed Barber - 5 years experience',
    experienceYears: 5,
    bio: 'Professional barber specializing in modern and classic cuts',
  });
};

const createPayments = async (appointments) => {
  const paid = [
    { appointment: appointments[0], method: 'card', deposit: 0 },
    { appointment: appointments[1], method: 'stripe', deposit: 0 },
    { appointment: appointments[2], method: 'cash', deposit: 500 },
  ];

  const payments = [];
  for (const entry of paid) {
    const payment = await Payment.create({
      appointmentId: entry.appointment._id,
      customerId: entry.appointment.customerId,
      amount: entry.appointment.totalAmount,
      depositAmount: entry.deposit,
      status: PAYMENT_STATUS.PAID,
      paymentMethod: entry.method,
      transactionId: `demo_${entry.appointment._id.toString().slice(-10)}`,
      paidAt: entry.appointment.endTime,
      metadata: { seeded: true },
    });
    payments.push(payment);

    await Appointment.updateOne(
      { _id: entry.appointment._id },
      { paymentId: payment._id, depositPaid: entry.deposit },
    );
  }

  // One refunded transaction so the payments table shows both states.
  const refunded = await Payment.create({
    appointmentId: appointments[3]._id,
    customerId: appointments[3].customerId,
    amount: 600,
    depositAmount: 0,
    status: PAYMENT_STATUS.REFUNDED,
    paymentMethod: 'card',
    transactionId: `demo_refund_${appointments[3]._id.toString().slice(-8)}`,
    paidAt: appointments[3].endTime,
    refundId: 're_demo_refund',
    refundAmount: 600,
    refundReason: 'Customer cancelled within the refund window',
    refundedAt: at(0, 9),
    metadata: { seeded: true },
  });
  payments.push(refunded);
  await Appointment.updateOne(
    { _id: appointments[3]._id },
    { paymentId: refunded._id },
  );

  // Pending payment for an upcoming appointment.
  const pending = await Payment.create({
    appointmentId: appointments[4]._id,
    customerId: appointments[4].customerId,
    amount: appointments[4].totalAmount,
    depositAmount: 0,
    status: PAYMENT_STATUS.PENDING,
    paymentMethod: 'stripe',
    metadata: { seeded: true },
  });
  payments.push(pending);
  await Appointment.updateOne(
    { _id: appointments[4]._id },
    { paymentId: pending._id },
  );

  logger.info(`${payments.length} payments created`);
  return payments;
};

const createQueue = async ({ branch, services, barbers, customers, appointment }) => {
  const entries = [
    {
      branchId: branch._id,
      customerId: customers[0]._id,
      requestedBarberId: barbers[0]._id,
      serviceIds: [services.find((s) => s.name === 'Haircut')._id],
      appointmentId: appointment?._id || null,
      status: QUEUE_STATUS.WAITING,
      position: 1,
      estimatedWaitTime: 15,
      joinedAt: minutesAgo(12),
      notes: 'Walk-in, prefers a short cut',
    },
    {
      branchId: branch._id,
      customerId: customers[2]._id,
      requestedBarberId: null,
      serviceIds: [
        services.find((s) => s.name === 'Beard Trim')._id,
        services.find((s) => s.name === 'Shave')._id,
      ],
      status: QUEUE_STATUS.WAITING,
      position: 2,
      estimatedWaitTime: 35,
      joinedAt: minutesAgo(6),
    },
    {
      branchId: branch._id,
      customerId: customers[1]._id,
      requestedBarberId: barbers[0]._id,
      serviceIds: [services.find((s) => s.name === 'Haircut')._id],
      status: QUEUE_STATUS.IN_PROGRESS,
      position: 0,
      estimatedWaitTime: 0,
      joinedAt: minutesAgo(40),
      startedAt: minutesAgo(25),
    },
  ];

  const created = await Queue.insertMany(entries);
  logger.info(`${created.length} queue entries created`);
  return created;
};

const createAuditLogs = async ({ admin, barberUser, appointments, payment, queueEntry }) => {
  const entries = [
    {
      userId: admin._id,
      action: 'appointment.created',
      targetType: 'Appointment',
      targetId: appointments[0]._id,
      changes: { status: APPOINTMENT_STATUS.BOOKED },
      metadata: { source: 'admin-dashboard' },
    },
    {
      userId: barberUser._id,
      action: 'appointment.status_changed',
      targetType: 'Appointment',
      targetId: appointments[4]._id,
      changes: { from: APPOINTMENT_STATUS.BOOKED, to: APPOINTMENT_STATUS.CONFIRMED },
      metadata: { source: 'barber-dashboard' },
    },
    {
      userId: admin._id,
      action: 'payment.refunded',
      targetType: 'Payment',
      targetId: payment._id,
      changes: { refundAmount: 600 },
      metadata: { source: 'admin-dashboard' },
    },
    {
      userId: admin._id,
      action: 'queue.joined',
      targetType: 'Queue',
      targetId: queueEntry._id,
      changes: { position: 1 },
      metadata: { source: 'walk-in' },
    },
    {
      userId: admin._id,
      actorType: 'system',
      action: 'appointment.no_show_flagged',
      targetType: 'Appointment',
      targetId: appointments[8]._id,
      changes: { status: APPOINTMENT_STATUS.NO_SHOW },
      metadata: { source: 'scheduler' },
    },
    {
      userId: barberUser._id,
      action: 'user.login',
      targetType: 'User',
      targetId: barberUser._id,
      ip: '203.0.113.24',
      userAgent: 'Mozilla/5.0 (demo seed)',
    },
  ];

  const created = await AuditLog.insertMany(entries);
  logger.info(`${created.length} audit log entries created`);
  return created;
};

const createAppointments = async ({ branches, services, chairs, barbers, customers }) => {
  const [main, downtown] = branches;
  const [barberOne, barberTwo] = barbers;
  const customer = (index) => customers[index % customers.length]._id;
  const service = (name) => services.find((s) => s.name === name);
  const chairOf = (branchChairs, type) =>
    (branchChairs.find((c) => c.type === type) || branchChairs[0])._id;

  const mainChairs = chairs[main._id.toString()];
  const downtownChairs = chairs[downtown._id.toString()];

  const payload = [
    // 0: completed yesterday, paid
    {
      customerId: customer(0),
      barberId: barberOne._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'hair'),
      serviceIds: [service('Haircut')._id],
      startTime: at(-1, 10),
      endTime: at(-1, 10, 30),
      status: APPOINTMENT_STATUS.COMPLETED,
      actualStartTime: at(-1, 10, 2),
      actualEndTime: at(-1, 10, 32),
      totalAmount: 500,
    },
    // 1: completed yesterday, paid
    {
      customerId: customer(1),
      barberId: barberTwo._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'shave'),
      serviceIds: [service('Shave')._id, service('Beard Trim')._id],
      startTime: at(-1, 12),
      endTime: at(-1, 13),
      status: APPOINTMENT_STATUS.COMPLETED,
      actualStartTime: at(-1, 12, 5),
      actualEndTime: at(-1, 13, 2),
      totalAmount: 900,
    },
    // 2: completed two days ago, deposit paid
    {
      customerId: customer(2),
      barberId: barberOne._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'hair'),
      serviceIds: [service('Hair Color')._id],
      startTime: at(-2, 15),
      endTime: at(-2, 16, 30),
      status: APPOINTMENT_STATUS.COMPLETED,
      actualStartTime: at(-2, 15),
      actualEndTime: at(-2, 16, 35),
      totalAmount: 1500,
      depositPaid: 500,
    },
    // 3: cancelled today (carries the refunded payment)
    {
      customerId: customer(0),
      barberId: barberTwo._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'shave'),
      serviceIds: [service('Shave')._id],
      startTime: at(0, 18),
      endTime: at(0, 18, 40),
      status: APPOINTMENT_STATUS.CANCELLED,
      totalAmount: 600,
      notes: 'Customer cancelled - chair released',
    },
    // 4: confirmed later today (pending payment)
    {
      customerId: customer(1),
      barberId: barberOne._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'hair'),
      serviceIds: [service('Haircut')._id],
      startTime: inHours(2),
      endTime: new Date(inHours(2).getTime() + 30 * 60 * 1000),
      status: APPOINTMENT_STATUS.CONFIRMED,
      totalAmount: 500,
    },
    // 5: in progress right now
    {
      customerId: customer(2),
      barberId: barberOne._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'nail'),
      serviceIds: [service('Manicure')._id],
      startTime: minutesAgo(25),
      endTime: new Date(Date.now() + 5 * 60 * 1000),
      status: APPOINTMENT_STATUS.IN_PROGRESS,
      actualStartTime: minutesAgo(20),
      totalAmount: 800,
    },
    // 6: booked later today
    {
      customerId: customer(0),
      barberId: barberTwo._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'hair'),
      serviceIds: [service('Haircut')._id, service('Beard Trim')._id],
      startTime: inHours(4),
      endTime: new Date(inHours(4).getTime() + 50 * 60 * 1000),
      status: APPOINTMENT_STATUS.BOOKED,
      totalAmount: 800,
    },
    // 7: booked tomorrow at the second branch
    {
      customerId: customer(1),
      barberId: barberTwo._id,
      branchId: downtown._id,
      chairId: chairOf(downtownChairs, 'hair'),
      serviceIds: [service('Haircut')._id],
      startTime: at(1, 15),
      endTime: at(1, 15, 30),
      status: APPOINTMENT_STATUS.BOOKED,
      totalAmount: 500,
    },
    // 8: no-show yesterday
    {
      customerId: customer(2),
      barberId: barberTwo._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'hair'),
      serviceIds: [service('Haircut')._id],
      startTime: at(-1, 18),
      endTime: at(-1, 18, 30),
      status: APPOINTMENT_STATUS.NO_SHOW,
      totalAmount: 500,
      notes: 'Did not arrive within the grace period',
    },
    // 9: rescheduled, confirmed for later this week
    {
      customerId: customer(0),
      barberId: barberOne._id,
      branchId: main._id,
      chairId: chairOf(mainChairs, 'shave'),
      serviceIds: [service('Shave')._id],
      startTime: at(2, 11),
      endTime: at(2, 11, 40),
      originalStartTime: at(-1, 16),
      status: APPOINTMENT_STATUS.CONFIRMED,
      totalAmount: 600,
      rescheduleHistory: [
        {
          from: at(-1, 16),
          to: at(2, 11),
          reason: 'Customer had a work conflict',
          updatedAt: at(-1, 14),
        },
      ],
    },
  ];

  const appointments = await Appointment.insertMany(payload);
  logger.info(`${appointments.length} appointments created`);
  return appointments;
};

export const ensureDemoData = async () => {
  const admin = await ensureUser({
    name: 'Admin User',
    email: 'admin@barber.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
  });

  const barberUser = await ensureUser({
    name: 'John Barber',
    email: 'barber@barber.com',
    password: 'barber123',
    role: 'barber',
    phone: '+92123456780',
    isActive: true,
  });

  const secondBarberUser = await ensureUser({
    name: 'Sara Stylist',
    email: 'sara@barber.com',
    password: 'barber123',
    role: 'barber',
    phone: '+92123456785',
    isActive: true,
  });

  const firstCustomer = await ensureUser({
    name: 'Ali Customer',
    email: 'customer@barber.com',
    password: 'customer123',
    role: 'customer',
    phone: '+92123456781',
    isActive: true,
  });

  const secondCustomer = await ensureUser({
    name: 'Hina Customer',
    email: 'hina@barber.com',
    password: 'customer123',
    role: 'customer',
    phone: '+92123456782',
    isActive: true,
  });

  const thirdCustomer = await ensureUser({
    name: 'Bilal Customer',
    email: 'bilal@barber.com',
    password: 'customer123',
    role: 'customer',
    phone: '+92123456783',
    isActive: true,
  });

  const mainBranch = await ensureBranch({
    name: 'Main Branch',
    code: 'MB001',
    address: {
      street: '123 Main Street',
      city: 'Karachi',
      country: 'Pakistan',
    },
    phone: '+92123456789',
    timezone: 'Asia/Karachi',
    workingHours: {
      start: '09:00',
      end: '21:00',
      breaks: [
        { start: '13:00', end: '14:00' },
        { start: '18:00', end: '18:30' },
      ],
    },
    capacity: { totalChairs: 5, totalBarbers: 2 },
    isActive: true,
    settings: {
      allowWalkIn: true,
      allowOnlineBooking: true,
      maxDaysAdvance: 30,
      minMinutesAdvance: 30,
      noShowGraceMinutes: 15,
    },
  });

  const downtownBranch = await ensureBranch({
    name: 'Downtown Branch',
    code: 'DT002',
    address: {
      street: '45 Clifton Road',
      city: 'Karachi',
      country: 'Pakistan',
    },
    phone: '+92123456790',
    timezone: 'Asia/Karachi',
    workingHours: {
      start: '10:00',
      end: '20:00',
      breaks: [{ start: '14:00', end: '15:00' }],
    },
    capacity: { totalChairs: 3, totalBarbers: 1 },
    isActive: true,
    settings: {
      allowWalkIn: true,
      allowOnlineBooking: true,
      maxDaysAdvance: 30,
      minMinutesAdvance: 30,
      noShowGraceMinutes: 15,
    },
  });

  const services = await ensureServices(mainBranch);
  await Service.updateMany(
    { _id: { $in: services.map((s) => s._id) } },
    { $addToSet: { branchIds: downtownBranch._id } },
  );

  const mainChairs = await ensureChairs(mainBranch, 5);
  const downtownChairs = await ensureChairs(downtownBranch, 3);

  const branches = [mainBranch, downtownBranch];
  const chairs = {
    [mainBranch._id.toString()]: mainChairs,
    [downtownBranch._id.toString()]: downtownChairs,
  };

  const barberOne = await ensureBarber({
    user: barberUser,
    branch: mainBranch,
    branches,
    services,
  });
  const barberTwo = await ensureBarber({
    user: secondBarberUser,
    branch: downtownBranch,
    branches: [downtownBranch],
    services,
  });
  const barbers = [barberOne, barberTwo];

  // Accounts registered through the app are included in the rotation so their
  // own dashboards have bookings too.
  const registeredCustomers = await User.find({
    role: 'customer',
    _id: {
      $nin: [firstCustomer._id, secondCustomer._id, thirdCustomer._id],
    },
  }).limit(2);

  const customers = [
    firstCustomer,
    secondCustomer,
    thirdCustomer,
    ...registeredCustomers,
  ];

  if ((await Appointment.countDocuments()) > 0) {
    logger.info('Appointments already exist - skipping activity data');
    return { skipped: true };
  }

  const appointments = await createAppointments({
    branches,
    services,
    chairs,
    barbers,
    customers,
  });

  const payments = await createPayments(appointments);
  const queue = await createQueue({
    branch: mainBranch,
    services,
    barbers,
    customers,
    appointment: appointments[4],
  });
  await createAuditLogs({
    admin,
    barberUser,
    appointments,
    payment: payments[3],
    queueEntry: queue[0],
  });

  logger.info('✅ Demo data ready (branches, users, services, chairs, appointments, payments, queue, audit logs)');
  return {
    branches: branches.length,
    services: services.length,
    chairs: mainChairs.length + downtownChairs.length,
    barbers: barbers.length,
    customers: customers.length,
    appointments: appointments.length,
    payments: payments.length,
    queue: queue.length,
  };
};

export default ensureDemoData;
