import { BouquetFleur, Like } from '../models/assoc.model';
import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

const USER_LOGIN = 'admin';
const USER_PASSWORD = 'pass123';
const USER_NOM_COMPLET = 'Admin test';

export const seedDatabase = async () => {
  try {
    console.log(' starting database seeding...');

    const jasmine = await Fleur.create({
      nom: 'Jasmin',
      description: 'Parfum envoûtant',
      prixUnitaire: 2.5,
    });
    const rose = await Fleur.create({
      nom: 'Rose Rouge',
      description: "Symbole de l'amour",
      prixUnitaire: 5.0,
    });

    const bqtTunis = await Bouquet.create({
      nom: 'Bouquet de Tunis',
      description: 'Mélange de jasmins',
      image: '/images/bouquetTunis.jpg',
      prix: 50.0,
      likes: 0,
    });

    const bqtAlger = await Bouquet.create({
      nom: "Bouquet d'Alger",
      description: 'Senteurs méditerranéennes',
      image: '/images/bouquetAlger.webp',
      prix: 75.0,
      likes: 0,
    });

    await BouquetFleur.create({
      BouquetId: bqtTunis.id,
      FleurId: jasmine.id,
      quantite: 10,
    });
    await BouquetFleur.create({
      BouquetId: bqtAlger.id,
      FleurId: rose.id,
      quantite: 5,
    });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(USER_PASSWORD, salt);

    const user1 = await User.create({
      login: USER_LOGIN,
      password: hashedPassword,
      nomComplet: USER_NOM_COMPLET,
    });

    await Like.create({ UserId: user1.id, BouquetId: bqtTunis.id });

    await bqtTunis.increment('likes');

    console.log(
      `✅ Utilisateur de test créé: ${USER_LOGIN} / ${USER_PASSWORD}`,
    );
    console.log('database seeded successfully!');
  } catch (error) {
    console.error('seeding failed:', error);
  }
};
