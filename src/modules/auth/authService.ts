import User from '../../models/user';
import { APP_CONSTANTS } from '../../assets';
import { ConflictError } from '../../utils/Error';

export const createUser = async ({ email, password, role }: any) => {
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    throw new ConflictError(APP_CONSTANTS.USER_EXISTS);
  }

  const user = await User.create({ email, password, role });

  return user;
};

export const findUser = async ({ email }: any) => {
  const user = await User.findOne({
    email,
    removed: { $ne: true },
  }).select('+password');

  return user;
};
