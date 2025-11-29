
import AuthorModel from "./author.model.js";
import { sequelize } from "../db/db.index";

const Author = AuthorModel(sequelize);

export const models = {
  Author,
};

export default models;
