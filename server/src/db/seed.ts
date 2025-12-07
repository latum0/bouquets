import { BouquetFleur, Like } from '../models/assoc.model';
import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';
import { User } from '../models/user.model';

export const seedDatabase = async () => {
  try {
    const count = await Bouquet.count();
    if (count > 0) {
      console.log('database already has data, deeding skipped');
      return;
    }

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
      image: 'bouquetTunis.jpg',
      prix: 50.0,
      likes: 0,
    });

    const bqtAlger = await Bouquet.create({
      nom: "Bouquet d'Alger",
      description: 'Senteurs méditerranéennes',
      image: 'bouquetAlger.webp',
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

    const user1 = await User.create({
      login: 'user1',
      password: 'password',
      nomComplet: 'user name',
    });

    await Like.create({ UserId: user1.id, BouquetId: bqtTunis.id });

    await bqtTunis.increment('likes');

    console.log('database seeded successfully!');
  } catch (error) {
    console.error('seeding failed:', error);
  }
};
