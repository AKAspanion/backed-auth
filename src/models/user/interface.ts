import { Document } from 'mongoose';

export interface UserDocument extends Document {
  role: string;
  email: string;
  password: string;
  active: Boolean;
  removed: Boolean;
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  matchPassword: (password: string) => Promise<boolean>;
}
