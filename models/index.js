const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductDetailsModel = require('./ProductDetails');
const PaymentFormInventoriesModel = require('./PaymentFormInventories');
const TarjetaBancoModel = require('./TarjetaBanco');
const TipoDocIdentificacionModel = require('./TipoDocIdentificacion');
const SucursalModel = require('./Sucursal');
const UsuarioModel = require('./Usuario');
const PersonaModel = require('./Persona');


const ProductDetails = ProductDetailsModel(sequelize, DataTypes);
const PaymentFormInventories = PaymentFormInventoriesModel(sequelize, DataTypes);
const TarjetaBanco = TarjetaBancoModel(sequelize, DataTypes);
const TipoDocIdentificacion = TipoDocIdentificacionModel(sequelize, DataTypes);
const Sucursal = SucursalModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Persona = PersonaModel(sequelize, DataTypes);

const db = {};
db.ProductDetails = ProductDetails;
db.PaymentFormInventories = PaymentFormInventories;
db.TarjetaBanco = TarjetaBanco;
db.TipoDocIdentificacion = TipoDocIdentificacion;
db.Sucursal = Sucursal;
db.Usuario = Usuario;
db.Persona = Persona;
db.Sequelize = sequelize;

module.exports = db;
