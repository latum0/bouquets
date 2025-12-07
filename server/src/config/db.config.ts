import { Sequelize } from 'sequelize';
const dbConfig = {
  DB: 'bouquet',
  USER: 'user',
  PASSWORD: 'password',
  HOST: './dev.sqlite',
  dialect: 'sqlite',
};

export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
    host: dbConfig.HOST,
  },
);
