import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

interface BouquetAttributes {
  id: number;
  nom: string;
  description: string;
  image: string;
  prix: number;
  likes: number;
}

interface BouquetCreationAttributes
  extends Optional<BouquetAttributes, 'id' | 'likes'> {}

export class Bouquet
  extends Model<BouquetAttributes, BouquetCreationAttributes>
  implements BouquetAttributes
{
  public id!: number;
  public nom!: string;
  public description!: string;
  public image!: string;
  public prix!: number;
  public likes!: number;
}

Bouquet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Bouquet',
  },
);
