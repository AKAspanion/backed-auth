import mongoose from 'mongoose';

const userModel = {
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Password is required'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  removed: {
    type: Boolean,
    default: false,
  },
};

export const UserSchema = new mongoose.Schema(userModel);

const User = mongoose.model('User', UserSchema);

export default User;
