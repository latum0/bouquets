import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

interface FleurAttributes {
  id: number;
  nom: string;
  description: string;
  prixUnitaire: number;
}

interface FleurCreationAttributes extends Optional<FleurAttributes, 'id'> {}

export class Fleur
  extends Model<FleurAttributes, FleurCreationAttributes>
  implements FleurAttributes
{
  public id!: number;
  public nom!: string;
  public description!: string;
  public prixUnitaire!: number;
}
Fleur.init(
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
    prixUnitaire: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Fleur',
  },
);
