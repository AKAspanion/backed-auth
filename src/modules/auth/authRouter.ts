import express from 'express';

import { register, login, logout, me } from './authController';
import AuthHandler from '../../middlewares/AuthHandler';

const router = express.Router();
const { userGuard } = new AuthHandler();

router.post('/login', login);
router.post('/logout', userGuard, logout);
router.post('/register', register);

router.get('/me', userGuard, me);

export default router;
