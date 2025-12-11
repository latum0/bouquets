import { Router } from 'express';
import { addFleur, getAllFleurs } from '../controller/fleur.controller';

const router = Router();

router.get('/', getAllFleurs); // GET /api/fleurs
router.post('/', addFleur); // POST /api/fleurs (pour ajouter une fleur)

export default router;
