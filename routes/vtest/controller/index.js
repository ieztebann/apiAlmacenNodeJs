// Importar los controladores
const PersonController = require('./Person');
const ProductController = require('./Product');
const OutputController = require('./Output');
const VehicleController = require('./Vehicle');
const UtilController = require('./util');

// Exportar todos los controladores en un solo objeto
const controller = {};
controller.ProductController = ProductController;
controller.PersonController = PersonController;
controller.UtilController = UtilController;
controller.VehicleController = VehicleController;
controller.OutputController = OutputController;

module.exports = controller;
