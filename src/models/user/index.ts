import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import RedisClient from '../../redis';
import { UserDocument } from './interface';
import { createToken } from '../../utils/Token';
import { USER_ROLES, APP_CONSTANTS } from '../../assets';

const userModel = {
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      APP_CONSTANTS.INVALID_EMAIL,
    ],
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

export const UserSchema = new mongoose.Schema<UserDocument>(userModel, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

UserSchema.pre<UserDocument>('save', async function (next: any) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

UserSchema.methods.getAccessToken = function () {
  return createToken({ id: this._id }, process.env.JWT_ACCESS_KEY as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });
};

UserSchema.methods.getRefreshToken = async function () {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const token = await createToken(
        { id: this._id },
        process.env.JWT_REFRSH_KEY as string,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
        },
      );

      await RedisClient.set(this._id, token, 'EX', 365 * 24 * 60 * 60);

      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
