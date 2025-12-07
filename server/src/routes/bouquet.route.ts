import { Router } from 'express';
import { getAllBouquets } from '../controller/bouquet.controller';

const route = Router();

route.get('/', getAllBouquets);

export default route;
