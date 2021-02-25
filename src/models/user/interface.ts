import { Document } from 'mongoose';

export interface UserDocument extends Document {
  role: string;
  email: string;
  password: string;
  active: Boolean;
  removed: Boolean;
  matchPassword: (password: string) => Promise<boolean>;
}
