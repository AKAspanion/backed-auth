import mongoose from 'mongoose';

// import { BadRequestError } from '../../utils/Error';

const User = mongoose.model('User');

export const getAllUsers = async () => {
  const response = await User.find({
    active: true,
  });

  return response;
};

export const registerUser = async (data: any) => {
  // const foundUser = await User.findOne({ email: data.email });

  // if (foundUser) {
  //   throw new BadRequestError('User already exists');
  // }
  const user = await User.create(data);

  return user;
};
