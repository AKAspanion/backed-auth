import express from 'express';

import { register, login, logout, me, refreshToken } from './authController';
import AuthHandler from '../../middlewares/AuthHandler';

const router = express.Router();
const { guard } = new AuthHandler();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', guard, logout);
router.post('/refreshtoken', guard, refreshToken);

router.get('/me', guard, me);

export default router;
