import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.config';

export class BouquetFleur extends Model {}
BouquetFleur.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { sequelize, modelName: 'BouquetFleur' },
);

export class Like extends Model {}
Like.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  { sequelize, modelName: 'Like' },
);

export class Achat extends Model {}
Achat.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    dateAchat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'Achat' },
);
