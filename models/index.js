const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductModel = require('./Product');
const ProductDetailsModel = require('./ProductDetails');
const PaymentFormInventoriesModel = require('./PaymentFormInventories');
const TarjetaBancoModel = require('./TarjetaBanco');
const TipoDocIdentificacionModel = require('./TipoDocIdentificacion');
const SucursalModel = require('./Sucursal');
const UsuarioModel = require('./Usuario');
const PersonaModel = require('./Persona');
const CreditoModel = require('./Credito');
const VehicleModel = require('./Vehicle');
const ExternalVehicleModel = require('./ExternalVehicle');
const EmpresaSistemaModel = require('./EmpresaSistema');


const Product = ProductModel(sequelize, DataTypes);
const ProductDetails = ProductDetailsModel(sequelize, DataTypes);
const PaymentFormInventories = PaymentFormInventoriesModel(sequelize, DataTypes);
const TarjetaBanco = TarjetaBancoModel(sequelize, DataTypes);
const TipoDocIdentificacion = TipoDocIdentificacionModel(sequelize, DataTypes);
const Sucursal = SucursalModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Persona = PersonaModel(sequelize, DataTypes);
const Credito = CreditoModel(sequelize, DataTypes);
const Vehicle = VehicleModel(sequelize, DataTypes);
const ExternalVehicle = ExternalVehicleModel(sequelize, DataTypes);
const EmpresaSistema = EmpresaSistemaModel(sequelize, DataTypes);

const db = {};
db.Product = Product;
db.ProductDetails = ProductDetails;
db.PaymentFormInventories = PaymentFormInventories;
db.TarjetaBanco = TarjetaBanco;
db.TipoDocIdentificacion = TipoDocIdentificacion;
db.Sucursal = Sucursal;
db.Usuario = Usuario;
db.Persona = Persona;
db.Credito = Credito;
db.Vehicle = Vehicle;
db.ExternalVehicle = ExternalVehicle;
db.EmpresaSistema = EmpresaSistema;
db.Sequelize = sequelize;

module.exports = db;
