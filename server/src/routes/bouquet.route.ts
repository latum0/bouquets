import { Router } from 'express';
import {
  bouquetDraft,
  deleteBouquet,
  finalizeBouquet,
  getAllBouquets,
  getBouquetDraft,
  getBouquetLikes,
  updateBouquet,
} from '../controller/bouquet.controller';
import { upload } from '../middlewares/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const route = Router();

route.get('/', authMiddleware, getAllBouquets);
route.post('/draft', authMiddleware, upload.single('image'), bouquetDraft);
route.get('/draft', authMiddleware, getBouquetDraft);

route.post('/final', authMiddleware, upload.single('image'), finalizeBouquet);
route.put('/:id', authMiddleware, updateBouquet);
route.delete('/:id', authMiddleware, deleteBouquet);

route.get('/:id/likes', getBouquetLikes);

export default route;
