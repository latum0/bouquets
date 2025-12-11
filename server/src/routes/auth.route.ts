import { Router } from 'express';
import { login, registerUser } from '../controller/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', registerUser);

export default router;
