import { sequelize } from '../config/db.config.js';
import AuthorModel from './author.model.js';

const Author = AuthorModel(sequelize);

export const models = {
  Author,
};

export default models;
