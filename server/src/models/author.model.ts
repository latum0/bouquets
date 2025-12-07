import { DataTypes, Model, Sequelize } from 'sequelize';

interface AuthorAttributes {
  id: number;
  name?: string | null;
  lastName?: string | null;
  birthDate?: Date | null;
}

export class Author
  extends Model<AuthorAttributes>
  implements AuthorAttributes
{
  public id!: number;
  public name!: string | null;
  public lastName!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Author.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'authors',
      timestamps: true,
    },
  );

  return Author;
};
