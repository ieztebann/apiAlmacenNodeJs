// Importar los controladores
const PersonController = require('./Person');
const UtilController = require('./util');

// Exportar todos los controladores en un solo objeto
const controller = {};
controller.PersonController = PersonController;
controller.UtilController = UtilController;

module.exports = controller;
