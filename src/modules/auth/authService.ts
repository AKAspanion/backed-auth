import mongoose from 'mongoose';

const User = mongoose.model('User');

export const registerUser = async (data: any) => {
  const user = await User.create(data);

  return user;
};
