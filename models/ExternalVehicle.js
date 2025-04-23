const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('ExternalVehicle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id',
        },
        plate: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'plate',
        },
        model: {
            type: DataTypes.STRING(4),
            allowNull: true,
            field: 'model',
        },
        idPersonaPropietario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_persona_propietario',
        },
        idMarcaVehiculo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_marca_vehiculo',
        },
        idLineaMarcaVehiculo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_linea_marca_vehiculo',
        },
        observacion: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'observacion',
        },
        idUsuarioCre: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_usuario_cre',
        },
        idUsuarioMod: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_usuario_mod',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updated_at',
        },
    }, {
        tableName: 'external_vehicles',
        schema: 'almacen',
        timestamps: false,
        hooks: {
            beforeCreate: (vehicle) => {
                // Implementar lógica adicional antes de insertar el registro
            },
            beforeUpdate: (vehicle) => {
                // Implementar lógica adicional antes de actualizar el registro
            },
        },
    });
};
