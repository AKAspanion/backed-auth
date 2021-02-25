import express from 'express';

import { register, login, logout } from './authController';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

export default router;
