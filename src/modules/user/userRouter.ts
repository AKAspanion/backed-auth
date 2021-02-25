import express from 'express';

import AuthHandler from '../../middlewares/AuthHandler';
import { getUsers } from './userController';

const router = express.Router();
const { guard, authorize } = new AuthHandler();

router.get('/', guard, authorize('ADMIN'), getUsers);

export default router;
