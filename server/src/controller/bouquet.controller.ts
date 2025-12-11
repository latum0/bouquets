import { NextFunction, Request, Response } from 'express';
import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';

import { Transaction } from 'sequelize';
import { sequelize } from '../config/db.config';
import { BouquetFleur } from '../models/assoc.model';

const DRAFT_COOKIE_NAME = 'bouquet_draft';
const COOKIE_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
};

interface FlowerData {
  fleurId: number;
  quantite: number;
}

interface BouquetDraftPayload {
  nom: string;
  description: string;
  image: string;
  prix: number;
  flowers: FlowerData[];
}

export const bouquetDraft = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  const { nom, description, prix, flowers } = req.body;

  let parsedFlowers: FlowerData[] = [];
  try {
    parsedFlowers = typeof flowers === 'string' ? JSON.parse(flowers) : flowers;
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Invalid format for flowers data.' });
  }

  if (!nom || !parsedFlowers || parsedFlowers.length === 0) {
    return res
      .status(400)
      .json({ message: 'Missing bouquet name or flowers.' });
  }

  const flowerIds = parsedFlowers.map((f: FlowerData) => f.fleurId);
  const existingFlowers = await Fleur.findAll({ where: { id: flowerIds } });

  if (existingFlowers.length !== flowerIds.length) {
    return res
      .status(400)
      .json({ message: 'At least one flower ID is invalid.' });
  }

  const imagePath = `/images/${req.file.filename}`;

  const draftData: BouquetDraftPayload = {
    nom,
    description,
    image: imagePath,
    prix: parseFloat(prix) || 0,
    flowers: parsedFlowers,
  };

  try {
    const draftJson = JSON.stringify(draftData);
    res.cookie(DRAFT_COOKIE_NAME, draftJson, COOKIE_OPTIONS);

    return res.status(202).json({
      message: 'Bouquet draft saved to session with image.',
      data: draftData,
    });
  } catch (error) {
    console.error('Error saving bouquet draft:', error);
    return res.status(500).json({ message: 'Could not process draft.' });
  }
};
export const finalizeBouquet = async (req: Request, res: Response) => {
  // 1. Récupération des données du CORPS
  const draftData: any = req.body;

  // 2. Validation des données minimales
  if (
    !draftData.nom ||
    !draftData.prix ||
    !draftData.image ||
    !draftData.flowers ||
    draftData.flowers.length === 0
  ) {
    return res.status(400).json({
      message:
        "Données de bouquet complètes manquantes dans le corps de la requête. Le nom, le prix, l'image et au moins une fleur sont requis.",
    });
  }

  let transaction: Transaction | undefined;

  try {
    // --- 3. Début de la transaction ---
    transaction = await sequelize.transaction();

    // --- 4. Création du Bouquet principal ---
    const newBouquet = await Bouquet.create(
      {
        nom: draftData.nom,
        description: draftData.description,
        image: draftData.image,
        prix: draftData.prix,
        likes: 0,
      },
      { transaction },
    );

    // --- 5. Création des associations BouquetFleur ---
    const associationPromises = draftData.flowers.map((f: any) =>
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

    // --- 6. Validation et Commit ---
    await transaction.commit();

    // --- 7. Nettoyage (Si un cookie de brouillon existait, le supprimer) ---
    // Le cookie est supprimé quel que soit son contenu, car le bouquet est finalisé.
    if (req.cookies[DRAFT_COOKIE_NAME]) {
      res.clearCookie(DRAFT_COOKIE_NAME);
    }

    // --- 8. Succès ---
    return res.status(201).json({
      message: 'Bouquet successfully finalized and saved!',
      bouquet: newBouquet,
    });
  } catch (error) {
    // --- 9. Gestion des Erreurs et Rollback ---
    if (transaction) await transaction.rollback();
    console.error('Error finalizing bouquet:', error);

    return res
      .status(500)
      .json({ message: 'Failed to finalize bouquet due to a database error.' });
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
    const draftData = JSON.parse(draftCookie) as BouquetDraftPayload;

    // Vous pouvez optionnellement valider ici la fraîcheur du brouillon

    return res.status(200).json(draftData);
  } catch (error) {
    console.error('Erreur lors du parsing du brouillon:', error);
    return res.status(400).json({ message: 'Format de brouillon invalide.' });
  }
};

export async function getAllBouquets(req: Request, res: Response) {
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
          as: 'Likers', // Must match the alias in db.index.ts (Bouquet.belongsToMany(User, { as: 'Likers' ... }))
          attributes: ['id', 'login', 'nomComplet'], // Don't return passwords!
        },
      ],
    });

    if (!bouquet) return res.status(404).json({ message: 'Bouquet not found' });

    // The type casting 'as any' might be needed if TS doesn't auto-infer the alias method
    return res.json((bouquet as any).Likers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching likers' });
  }
};
