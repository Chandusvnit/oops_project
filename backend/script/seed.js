import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../utils/db.js';
import User from '../models/User.js';
import Complaint from '../models/complaint.js';

// don't run it , it was just for injecting some test data for development


async function run() {
  await connectDB(process.env.MONGO_URI);

  console.log('Seeding users...');
  await User.deleteMany({});
  await Complaint.deleteMany({});

  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@hostel.com',
    password: hash('Admin123!'),
    role: 'admin'
  });

  const worker1 = await User.create({
    name: 'Worker One',
    email: 'worker1@hostel.com',
    password: hash('Worker123!'),
    role: 'worker'
  });

  const worker2 = await User.create({
    name: 'Worker Two',
    email: 'worker2@hostel.com',
    password: hash('Worker123!'),
    role: 'worker'
  });

  const s1 = await User.create({
    name: 'Student One',
    email: 's1@hostel.com',
    roomNumber: 'A-101',
    password: hash('Student123!'),
    role: 'student'
  });

  const s2 = await User.create({
    name: 'Student Two',
    email: 's2@hostel.com',
    roomNumber: 'B-204',
    password: hash('Student123!'),
    role: 'student'
  });

  console.log('Seeding complaints...');
  await Complaint.create([
    {
      userId: s1._id,
      category: 'electricity',
      description: 'Ceiling fan not working in room A-101.',
      status: 'Pending',
      comments: [{ author: s1._id, message: 'Please fix soon.' }]
    },
    {
      userId: s2._id,
      category: 'cleanliness',
      description: 'Common area needs cleaning near B block.',
      status: 'Assigned',
      assignedWorkerId: worker1._id,
      comments: [{ author: admin._id, message: 'Assigned to Worker One.' }]
    },
    {
      userId: s1._id,
      category: 'food',
      description: 'Mess food too spicy this week.',
      status: 'In Progress',
      assignedWorkerId: worker2._id,
      comments: [{ author: worker2._id, message: 'Discussing with mess staff.' }]
    }
  ]);

  console.log('✅ Seed complete');
  await disconnectDB();
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});

