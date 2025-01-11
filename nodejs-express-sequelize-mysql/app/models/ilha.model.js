module.exports = (sequelize, Sequelize) => {
  const Ilha = sequelize.define("ilha", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING
    }
  });

  return Ilha;
};
