import { Document } from 'mongoose';

export interface UserDocument extends Document {
  role: string;
  email: string;
  password: string;
  active: Boolean;
  removed: Boolean;
  getSignedToken: () => Promise<string>;
  matchPassword: (password: string) => Promise<boolean>;
}
