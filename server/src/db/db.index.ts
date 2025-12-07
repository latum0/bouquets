import { Bouquet } from '../models/bouquet.model';
import { Fleur } from '../models/fleur.model';
import { Achat, BouquetFleur, Like } from '../models/assoc.model';
import { User } from '../models/user.model';
import { seedDatabase } from './seed';
import { sequelize } from '../config/db.config';

Bouquet.belongsToMany(Fleur, { through: BouquetFleur });
Fleur.belongsToMany(Bouquet, { through: BouquetFleur });

User.belongsToMany(Bouquet, {
  through: Like,
  as: 'LikedBouquets',
});
Bouquet.belongsToMany(User, {
  through: Like,
  as: 'Likers',
});

User.belongsToMany(Bouquet, {
  through: Achat,
  as: 'PurchasedBouquets',
});
Bouquet.belongsToMany(User, {
  through: Achat,
  as: 'Buyers',
});

export const seqRun = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected.');
    await sequelize.sync({ alter: true });
    await seedDatabase();
  } catch (err) {
    console.error('db connection error:', err);
  }
};
