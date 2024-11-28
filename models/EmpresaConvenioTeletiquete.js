const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmpresaConvenioTeletiquete = sequelize.define('EmpresaConvenioTeletiquete', {
  id_empresa_convenio_teletiquete: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cod_empresa: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  wsdl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  id_usuario_cre: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fec_cre: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_usuario_mod: {
    type: DataTypes.INTEGER,
  },
  fec_mod: {
    type: DataTypes.DATE,
  },
  min_liberar_reserva: {
    type: DataTypes.NUMERIC,
    defaultValue: 60,
  },
  min_liberar_reserva_efecty: {
    type: DataTypes.NUMERIC,
    defaultValue: 60,
  },
  min_liberar_reserva_baloto: {
    type: DataTypes.NUMERIC,
    defaultValue: 60,
  },
  id_tipo_convenio_teletiquete: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  key_token: {
    type: DataTypes.TEXT,
  },
  nom_dominio: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  api: {
    type: DataTypes.TEXT,
  },
  sandbox: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  pagos_inteligentes: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  token_pagos_inteligentes: {
    type: DataTypes.TEXT,
  },
  cod_comercio_pagos_inteligentes: {
    type: DataTypes.TEXT,
  },
  token_pasarela_sandbox: {
    type: DataTypes.TEXT,
  },
  url_api_pagos_inteligentes: {
    type: DataTypes.TEXT,
    defaultValue: 'https://apiecommerce.pagosinteligentes.com:8070/',
  },
  cmd: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  iva_cms: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  fee: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  iva_fee: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  rti: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  rtf: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  cargo_fijo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  num_cargo_fijo: {
    type: DataTypes.NUMERIC,
    defaultValue: 0,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  apitravel: {
    type: DataTypes.STRING(200),
  },
}, {
  tableName: 'tb_empresa_convenio_teletiquete',
  timestamps: false,
});

module.exports = EmpresaConvenioTeletiquete;


