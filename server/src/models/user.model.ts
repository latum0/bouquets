import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

interface UserAttributes {
  id: number;
  login: string;
  password: string;
  nomComplet: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public login!: string;
  public password!: string;
  public nomComplet!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomComplet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  },
);
