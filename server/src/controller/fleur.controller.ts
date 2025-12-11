import { Request, Response } from 'express';
// Assurez-vous d'importer votre modèle Fleur
import { Fleur } from '../models/fleur.model';
// NOTE: Le chemin d'importation doit être ajusté en fonction de votre structure de projet.

/**
 * GET /api/fleurs
 * Récupère la liste de toutes les fleurs disponibles.
 */
export const getAllFleurs = async (req: Request, res: Response) => {
  try {
    // Utilise la méthode findAll() de Sequelize pour récupérer tous les enregistrements
    const fleurs = await Fleur.findAll({
      // Optionnel: choisir uniquement les champs pertinents pour réduire la charge utile
      attributes: ['id', 'nom', 'description', 'prixUnitaire'],
      order: [['nom', 'ASC']], // Optionnel: trier par nom
    });

    // Retourne la liste avec un statut 200 OK
    return res.status(200).json(fleurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des fleurs:', error);
    // Retourne un statut 500 en cas d'erreur serveur/base de données
    return res.status(500).json({
      message: 'Erreur interne du serveur lors de la récupération des fleurs.',
    });
  }
};

/**
 * POST /api/fleurs
 * Ajoute une nouvelle fleur. (Nécessite généralement une authentification Admin/Backoffice)
 */
export const addFleur = async (req: Request, res: Response) => {
  const { nom, description, prixUnitaire } = req.body;

  // 1. Validation de l'entrée
  if (!nom || !prixUnitaire) {
    return res
      .status(400)
      .json({ message: 'Le nom et le prix unitaire de la fleur sont requis.' });
  }

  // 2. Assurez-vous que le prix est un nombre valide
  const prix = parseFloat(prixUnitaire);
  if (isNaN(prix) || prix <= 0) {
    return res.status(400).json({
      message: 'Le prix unitaire doit être un nombre positif valide.',
    });
  }

  try {
    // Optionnel: vérifier si la fleur existe déjà par son nom
    const existingFleur = await Fleur.findOne({ where: { nom } });
    if (existingFleur) {
      return res
        .status(409)
        .json({ message: `Une fleur nommée '${nom}' existe déjà.` });
    }

    // 3. Création de l'enregistrement dans la base de données
    const newFleur = await Fleur.create({
      nom,
      description: description || '', // Utiliser une chaîne vide si la description est manquante
      prixUnitaire: prix,
    });

    // 4. Réponse: Statut 201 (Created)
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
    // Gérer les erreurs de base de données (ex: contraintes)
    return res.status(500).json({
      message: "Erreur interne du serveur lors de l'ajout de la fleur.",
    });
  }
};
