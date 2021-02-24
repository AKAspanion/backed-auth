import mongoose from 'mongoose';

import { APP_CONSTANTS } from '../assets';

const userModel = {
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: [true, APP_CONSTANTS.EMAIL_REQUIRED],
  },
  password: {
    type: String,
    select: false,
    required: [true, APP_CONSTANTS.PASSWORD_REQUIRED],
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
