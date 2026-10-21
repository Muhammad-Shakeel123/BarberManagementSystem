import { connectDB, closeDB } from '../config/database.js';
import logger from '../config/logger.js';
import { ensureDemoData } from './demoData.js';

// Additive demo data: keeps existing users and records, fills anything missing.
const seedDemo = async () => {
  try {
    await connectDB();
    const summary = await ensureDemoData();
    logger.info(`✅ Demo data step finished: ${JSON.stringify(summary)}`);
    await closeDB();
    process.exit(0);
  } catch (err) {
    logger.error('Demo data seeding failed:', err);
    process.exit(1);
  }
};

seedDemo();
