export const dbConfig = {
  DB: "your_db_name",
  USER: "your_db_user",
  PASSWORD: "your_db_password",
  HOST: "localhost",
  dialect: "mysql" as "mysql" | "postgres" | "sqlite" | "mariadb",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
