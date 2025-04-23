const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Vehicle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_vehiculo'
        },
        nroInterno: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'nro_interno'
        },
        placa: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'placa'
        },
        idTipoVehiculo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_tipo_vehiculo'
        },
        idMarcaVehiculo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_marca_vehiculo'
        },
        idEstVehiculo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'id_est_vehiculo'
        },
        idUsuarioCre: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_usuario_cre'
        },
        fecCre: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'fec_cre'
        },
        idUsuarioMod: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_mod'
        },
        fecMod: {
            type: DataTypes.DATE,
            field: 'fec_mod'
        },
        idEmpresaOperadora: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_empresa_operadora'
        },
        idEstRegistro: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'id_est_registro'
        }
    }, {
        tableName: 'tb_vehiculo',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: 'indice_nro_interno_vehiculo',
                fields: ['nro_interno']
            }
        ]
    });
};
