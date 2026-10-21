import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/database.js';
import logger from '../config/logger.js';

// Models
import User from '../models/user.model.js';
import Branch from '../models/branch.model.js';
import BarberProfile from '../models/barberProfile.model.js';
import Service from '../models/service.model.js';
import Chair from '../models/chair.model.js';

const seedData = async () => {
  try {
    await connectDB();
    logger.info('Connected to database for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await BarberProfile.deleteMany({});
    await Service.deleteMany({});
    await Chair.deleteMany({});
    logger.info('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@barber.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890',
      isActive: true,
    });
    await admin.save();
    logger.info(`Admin created: ${admin.email}`);

    // Create branch
    const branch = new Branch({
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
      capacity: {
        totalChairs: 5,
        totalBarbers: 3,
      },
      isActive: true,
      settings: {
        allowWalkIn: true,
        allowOnlineBooking: true,
        maxDaysAdvance: 30,
        minMinutesAdvance: 30,
        noShowGraceMinutes: 15,
      },
    });
    await branch.save();
    logger.info(`Branch created: ${branch.name}`);

    // Create services
    const services = await Service.insertMany([
      {
        name: 'Haircut',
        description: 'Classic haircut',
        duration: 30,
        price: 500,
        deposit: 0,
        isDepositRefundable: true,
        chairTypeRequired: 'hair',
        branchIds: [branch._id],
        category: 'Hair',
        isActive: true,
      },
      {
        name: 'Beard Trim',
        description: 'Professional beard trimming',
        duration: 20,
        price: 300,
        deposit: 0,
        isDepositRefundable: true,
        chairTypeRequired: 'shave',
        branchIds: [branch._id],
        category: 'Grooming',
        isActive: true,
      },
      {
        name: 'Hair Color',
        description: 'Full hair coloring service',
        duration: 90,
        price: 1500,
        deposit: 500,
        isDepositRefundable: false,
        chairTypeRequired: 'hair',
        branchIds: [branch._id],
        category: 'Color',
        isActive: true,
      },
      {
        name: 'Shave',
        description: 'Traditional hot towel shave',
        duration: 40,
        price: 600,
        deposit: 0,
        isDepositRefundable: true,
        chairTypeRequired: 'shave',
        branchIds: [branch._id],
        category: 'Grooming',
        isActive: true,
      },
      {
        name: 'Manicure',
        description: 'Professional nail care',
        duration: 45,
        price: 800,
        deposit: 0,
        isDepositRefundable: true,
        chairTypeRequired: 'nail',
        branchIds: [branch._id],
        category: 'Nails',
        isActive: true,
      },
    ]);
    logger.info(`${services.length} services created`);

    // Create chairs
    const chairs = [];
    for (let i = 1; i <= 5; i++) {
      chairs.push({
        branchId: branch._id,
        name: `Chair ${i}`,
        number: i,
        type: i <= 3 ? 'hair' : i === 4 ? 'shave' : 'nail',
        isOperational: true,
        isShared: true,
      });
    }
    await Chair.insertMany(chairs);
    logger.info(`${chairs.length} chairs created`);

    // Create barber
    const barberPassword = await bcrypt.hash('barber123', 10);
    const barberUser = new User({
      name: 'John Barber',
      email: 'barber@barber.com',
      password: barberPassword,
      role: 'barber',
      phone: '+92123456780',
      isActive: true,
    });
    await barberUser.save();

    const barber = new BarberProfile({
      userId: barberUser._id,
      branchId: branch._id,
      branches: [branch._id],
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
    await barber.save();
    logger.info(`Barber created: ${barberUser.email}`);

    // Create a customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = new User({
      name: 'Ali Customer',
      email: 'customer@barber.com',
      password: customerPassword,
      role: 'customer',
      phone: '+92123456781',
      isActive: true,
    });
    await customer.save();
    logger.info(`Customer created: ${customer.email}`);

    logger.info('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exit(1);
  }
};

// Run seeding
seedData();