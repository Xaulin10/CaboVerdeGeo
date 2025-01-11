module.exports = {
  HOST: "localhost",
  USER: "aulindo2",
  PASSWORD: "StrongPassword123!",
  DB: "CaboVerde",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
