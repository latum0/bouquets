import { NextFunction, Request, Response } from 'express';
import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';

export async function getAllBouquets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bouquets = await Bouquet.findAll({
      include: [
        {
          model: Fleur,
          through: { attributes: ['quantite'] },
        },
      ],
    });
    res.json(bouquets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching bouquets' });
  }
}
