import mongoose from 'mongoose';

const User = mongoose.model('User');

export const getAllUsers = async () => {
  const response = await User.find({
    active: true,
  });

  return response;
};
