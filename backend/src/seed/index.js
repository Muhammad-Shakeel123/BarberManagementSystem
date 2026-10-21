import { connectDB } from '../config/database.js';
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

import { ensureDemoData } from './demoData.js';

// FULL RESET: wipes every collection, then rebuilds the demo dataset.
// Prefer `npm run seed:demo` (src/seed/demo.js) when an existing database must
// keep the data and accounts it already has.
const resetAndSeed = async () => {
  try {
    await connectDB();
    logger.info('Connected to database for seeding');

    await User.deleteMany({});
    await Branch.deleteMany({});
    await BarberProfile.deleteMany({});
    await Service.deleteMany({});
    await Chair.deleteMany({});
    await Appointment.deleteMany({});
    await Payment.deleteMany({});
    await Queue.deleteMany({});
    await AuditLog.deleteMany({});
    logger.info('Cleared existing data');

    const summary = await ensureDemoData();
    logger.info(`✅ Seeding completed successfully: ${JSON.stringify(summary)}`);
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exit(1);
  }
};

resetAndSeed();
