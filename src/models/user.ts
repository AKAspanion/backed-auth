import mongoose from 'mongoose';

import { USER_ROLES, APP_CONSTANTS } from '../assets';

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
    minLength: [6, APP_CONSTANTS.PASSWORD_MIN_LENGTH],
    required: [true, APP_CONSTANTS.PASSWORD_REQUIRED],
  },
  role: {
    type: String,
    default: USER_ROLES.USER,
    enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
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

export const UserSchema = new mongoose.Schema(userModel, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

const User = mongoose.model('User', UserSchema);

export default User;
