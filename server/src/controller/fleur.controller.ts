import { Request, Response } from 'express';
import { Fleur } from '../models/fleur.model';

export const getAllFleurs = async (req: Request, res: Response) => {
  try {
    const attributes = ['id', 'nom', 'description'];

    if (req.isAuthenticated) {
      attributes.push('prixUnitaire');
    }

    const fleurs = await Fleur.findAll({
      attributes: attributes,
      order: [['nom', 'ASC']],
    });

    return res.status(200).json(fleurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des fleurs:', error);
    return res.status(500).json({
      message: 'Erreur interne du serveur lors de la récupération des fleurs.',
    });
  }
};

export const addFleur = async (req: Request, res: Response) => {
  const { nom, description, prixUnitaire } = req.body;

  if (!nom || !prixUnitaire) {
    return res
      .status(400)
      .json({ message: 'Le nom et le prix unitaire de la fleur sont requis.' });
  }

  const prix = parseFloat(prixUnitaire);
  if (isNaN(prix) || prix <= 0) {
    return res.status(400).json({
      message: 'Le prix unitaire doit être un nombre positif valide.',
    });
  }

  try {
    const existingFleur = await Fleur.findOne({ where: { nom } });
    if (existingFleur) {
      return res
        .status(409)
        .json({ message: `Une fleur nommée '${nom}' existe déjà.` });
    }

    const newFleur = await Fleur.create({
      nom,
      description: description || '',
      prixUnitaire: prix,
    });

    return res.status(201).json({
      message: 'Fleur ajoutée avec succès.',
      fleur: {
        id: newFleur.id,
        nom: newFleur.nom,
        description: newFleur.description,
        prixUnitaire: newFleur.prixUnitaire,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la fleur:", error);
    return res.status(500).json({
      message: "Erreur interne du serveur lors de l'ajout de la fleur.",
    });
  }
};
