import { Router } from 'express';
import {
  bouquetDraft,
  deleteBouquet,
  finalizeBouquet,
  getAllBouquets,
  getBouquetLikes,
  updateBouquet,
} from '../controller/bouquet.controller';
import { upload } from '../utils/multer';

const route = Router();

route.get('/', getAllBouquets);
route.post('/draft', upload.single('image'), bouquetDraft);
route.post('/final', finalizeBouquet);
route.put('/:id', updateBouquet);
route.delete('/:id', deleteBouquet);

route.get('/:id/likes', getBouquetLikes);

export default route;
