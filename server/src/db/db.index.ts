import { Sequelize, Op } from "sequelize";
import { dbConfig } from "../config/db.config";
import AuthorModel from "../models/author.model.js";


export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as any,
    pool: dbConfig.pool,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
})();

export const Author = AuthorModel(sequelize);

export const db = {
  sequelize,
  Author,
  Op,
};
export default db;
