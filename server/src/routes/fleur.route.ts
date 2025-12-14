import { Router } from 'express';
import { addFleur, getAllFleurs } from '../controller/fleur.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAllFleurs);
router.post('/', authMiddleware, addFleur);

export default router;
