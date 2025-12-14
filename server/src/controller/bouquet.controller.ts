import { NextFunction, Request, Response } from 'express';
import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';

import { Transaction } from 'sequelize';
import { sequelize } from '../config/db.config';
import { BouquetFleur } from '../models/assoc.model';
import { User } from '../models/user.model';

const DRAFT_COOKIE_NAME = 'bouquet_draft';
const COOKIE_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24, // 1 Day
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Secure in prod only
  sameSite: 'lax' as const,
};

interface FlowerData {
  fleurId: number;
  quantite: number;
}

interface BouquetPayload {
  nom?: string;
  description?: string;
  image?: string;
  prix?: number;
  flowers?: FlowerData[];
}

/**
 * BUTTON 1: SAVE DRAFT
 * Stores data in a cookie. Allows partial data (no strict validation).
 */
export const bouquetDraft = async (req: Request, res: Response) => {
  try {
    const { nom, description, prix, flowers, existingImage } = req.body;

    // 1. Handle Image: New upload takes precedence -> otherwise use existing string path -> otherwise null
    let imagePath = existingImage || null;
    if (req.file) {
      imagePath = `/images/${req.file.filename}`;
    }

    // 2. Parse Flowers safely (multipart/form-data sends arrays as JSON strings)
    let parsedFlowers: FlowerData[] = [];
    if (flowers) {
      try {
        parsedFlowers =
          typeof flowers === 'string' ? JSON.parse(flowers) : flowers;
      } catch (e) {
        parsedFlowers = []; // Fail gracefully for draft
      }
    }

    // 3. Construct Draft Data (Allowing partial/undefined values)
    const draftData: BouquetPayload = {
      nom: nom || '',
      description: description || '',
      image: imagePath,
      prix: prix ? parseFloat(prix) : undefined,
      flowers: parsedFlowers,
    };

    // 4. Save to Cookie
    res.cookie(DRAFT_COOKIE_NAME, JSON.stringify(draftData), COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Draft saved successfully.',
      data: draftData, // Return data so frontend can update state (especially the new image path)
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return res.status(500).json({ message: 'Could not save draft.' });
  }
};

/**
 * BUTTON 2: FINALIZE BOUQUET
 * Stores data in DB. Ignores cookies. Requires strict validation.
 */
export const finalizeBouquet = async (req: Request, res: Response) => {
  let transaction: Transaction | undefined;

  try {
    const { nom, description, prix, flowers, image } = req.body;

    // 1. Handle Image Logic for Finalization
    // User might upload a NEW file now, or send the string path from the previous draft save
    let finalImagePath = image;
    if (req.file) {
      finalImagePath = `/images/${req.file.filename}`;
    }

    // 2. Parse Flowers
    let parsedFlowers: FlowerData[] = [];
    try {
      parsedFlowers =
        typeof flowers === 'string' ? JSON.parse(flowers) : flowers;
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'Invalid format for flowers data.' });
    }

    // 3. STRICT Validation (Must be full form)
    if (
      !nom ||
      !finalImagePath ||
      !prix ||
      !parsedFlowers ||
      parsedFlowers.length === 0
    ) {
      return res.status(400).json({
        message:
          'Validation failed: Name, Price, Image, and at least one Flower are required.',
      });
    }

    // 4. Validate Flower IDs exist in DB (Data Integrity)
    const flowerIds = parsedFlowers.map((f) => f.fleurId);
    const count = await Fleur.count({ where: { id: flowerIds } });
    if (count !== flowerIds.length) {
      return res
        .status(400)
        .json({ message: 'One or more flower IDs are invalid.' });
    }

    // 5. Start DB Transaction
    transaction = await sequelize.transaction();

    // 6. Create Bouquet
    const newBouquet = await Bouquet.create(
      {
        nom,
        description,
        image: finalImagePath,
        prix: parseFloat(prix),
        likes: 0,
      },
      { transaction },
    );

    // 7. Create Associations (BouquetFleur)
    const associationPromises = parsedFlowers.map((f) =>
      BouquetFleur.create(
        {
          BouquetId: newBouquet.id,
          FleurId: f.fleurId,
          quantite: f.quantite,
        },
        { transaction },
      ),
    );

    await Promise.all(associationPromises);

    // 8. Commit Transaction
    await transaction.commit();

    // 9. Clear the Draft Cookie (Cleanup)
    if (req.cookies[DRAFT_COOKIE_NAME]) {
      res.clearCookie(DRAFT_COOKIE_NAME);
    }

    return res.status(201).json({
      message: 'Bouquet created successfully!',
      bouquet: newBouquet,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error finalizing bouquet:', error);
    return res.status(500).json({ message: 'Failed to finalize bouquet.' });
  }
};

export const getBouquetDraft = async (req: Request, res: Response) => {
  const draftCookie = req.cookies[DRAFT_COOKIE_NAME];

  if (!draftCookie) {
    // Retourne un statut 204 No Content ou un 404 si aucun brouillon n'est trouvé
    return res
      .status(204)
      .json({ message: 'Aucun brouillon de bouquet trouvé.' });
  }

  try {
    const draftData = JSON.parse(draftCookie);

    // Vous pouvez optionnellement valider ici la fraîcheur du brouillon

    return res.status(200).json(draftData);
  } catch (error) {
    console.error('Erreur lors du parsing du brouillon:', error);
    return res.status(400).json({ message: 'Format de brouillon invalide.' });
  }
};

export async function getAllBouquets(req: Request, res: Response) {
  try {
    const attributes = ['id', 'nom', 'description', 'image'];

    if (req.isAuthenticated) {
      attributes.push('prix', 'likes');
    }

    const bouquets = await Bouquet.findAll({
      attributes: attributes,
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

export const updateBouquet = async (req: Request, res: Response) => {
  const bouquetId = req.params.id;
  const { nom, description, prix, flowers } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const bouquet = await Bouquet.findByPk(bouquetId);
    if (!bouquet) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    await bouquet.update({ nom, description, prix }, { transaction });

    if (flowers && Array.isArray(flowers)) {
      await BouquetFleur.destroy({
        where: { BouquetId: bouquetId },
        transaction,
      });

      const newAssociations = flowers.map((f: any) => ({
        BouquetId: bouquetId,
        FleurId: f.fleurId,
        quantite: f.quantite,
      }));

      await BouquetFleur.bulkCreate(newAssociations, { transaction });
    }

    await transaction.commit();

    const updatedBouquet = await Bouquet.findByPk(bouquetId, {
      include: ['Fleurs'],
    });

    return res.json({
      message: 'Bouquet updated successfully',
      bouquet: updatedBouquet,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error updating bouquet:', error);
    return res.status(500).json({ message: 'Error updating bouquet' });
  }
};

export const deleteBouquet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await Bouquet.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    return res.json({ message: 'Bouquet deleted successfully' });
  } catch (error) {
    console.error('Error deleting bouquet:', error);
    return res.status(500).json({ message: 'Error deleting bouquet' });
  }
};

export const getBouquetLikes = async (req: Request, res: Response) => {
  try {
    const bouquet = await Bouquet.findByPk(req.params.id, {
      attributes: ['id', 'likes'],
    });

    if (!bouquet) return res.status(404).json({ message: 'Bouquet not found' });

    return res.json({ id: bouquet.id, likes: bouquet.likes });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching likes' });
  }
};

export const getBouquetLikers = async (req: Request, res: Response) => {
  try {
    const bouquet = await Bouquet.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'Likers',
          attributes: ['id', 'login', 'nomComplet'],
        },
      ],
    });

    if (!bouquet) return res.status(404).json({ message: 'Bouquet not found' });

    return res.json((bouquet as any).Likers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching likers' });
  }
};
