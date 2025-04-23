module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EmpresaSistema', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id_empresa_sistema', // Campo de la base de datos
            autoIncrement: true // Si es serial
        },
        idPersona: {
            type: DataTypes.INTEGER,
            field: 'id_persona',
        },
        principal: {
            type: DataTypes.BOOLEAN,
            field: 'principal'
        },
        id_est_empresa_sistema: {
            type: DataTypes.INTEGER,
            field: 'id_est_empresa_sistema'
        },
        id_usuario_cre: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_cre'
        },
        id_usuario_mod: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_mod'
        },
        fec_cre: {
            type: DataTypes.DATE,
            field: 'fec_cre'
        },
        fec_mod: {
            type: DataTypes.DATE,
            field: 'fec_mod'
        }
    }, {
        tableName: 'tb_empresa_sistema', // Nombre de la tabla
        schema: 'public', // Esquema de la base de datos
        timestamps: false // Desactivar las columnas automáticas `createdAt` y `updatedAt`
    });
};
