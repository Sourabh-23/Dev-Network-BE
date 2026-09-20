require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user');

const malePhotos = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
  'https://randomuser.me/api/portraits/men/9.jpg',
  'https://randomuser.me/api/portraits/men/10.jpg',
];

const femalePhotos = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
  'https://randomuser.me/api/portraits/women/9.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
];

const getRandomPhoto = (gender) => {
  const normalizedGender = String(gender || '').toLowerCase();

  if (normalizedGender === 'female') {
    return femalePhotos[Math.floor(Math.random() * femalePhotos.length)];
  }

  if (normalizedGender === 'male') {
    return malePhotos[Math.floor(Math.random() * malePhotos.length)];
  }

  return [...malePhotos, ...femalePhotos][Math.floor(Math.random() * (malePhotos.length + femalePhotos.length))];
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in the .env file');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

const updateAllUserPhotos = async () => {
  await connectDB();

  const users = await User.find({});

  for (const user of users) {
    const randomPhoto = getRandomPhoto(user.gender);
    user.photourl = randomPhoto;
    await user.save();
    console.log(`Updated ${user.firstName || user.email} -> ${randomPhoto}`);
  }

  console.log(`All users updated! Total users: ${users.length}`);
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

updateAllUserPhotos()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error updating user photos:', err.message);
    process.exit(1);
  });
