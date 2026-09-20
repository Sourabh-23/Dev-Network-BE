require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user');

const targetEmail = 'test@example.com';
const specificPhoto = 'https://randomuser.me/api/portraits/women/12.jpg';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in the .env file');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

const updateSingleUserPhoto = async () => {
  await connectDB();

  const user = await User.findOne({ email: targetEmail });

  if (!user) {
    console.log(`User not found for email: ${targetEmail}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  user.photourl = specificPhoto;
  await user.save();

  console.log(`Updated ${user.firstName} ${user.lastName} -> ${user.photourl}`);
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

updateSingleUserPhoto()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error updating user photo:', err.message);
    process.exit(1);
  });
