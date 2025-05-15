const { Sequelize } = require('sequelize'); 
// Crea una instancia de Sequelize con la conexión a PostgreSQL
const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  logging: console.log, // Habilita logs de Sequelize
  //logging: false, // deshabilita logs de Sequelize
  dialect: 'postgres',  // Define que usarás PostgreSQL
});

module.exports = sequelize;


