import mongoose from 'mongoose';

// import { BadRequestError } from '../../utils/Error';

const User = mongoose.model('User');

export const getAllUsers = async () => {
  const response = await User.find({
    active: true,
  });

  return response;
};
