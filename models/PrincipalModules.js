module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PrincipalModules', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id_modulo_ppl', // Campo de la base de datos
            autoIncrement: true // Si es serial
        },
        url: {
            type: DataTypes.STRING,
            field: 'url',
        },
    }, {
        tableName: 'tb_modulo_ppl', // Nombre de la tabla
        schema: 'public', // Esquema de la base de datos
        timestamps: false // Desactivar las columnas automáticas `createdAt` y `updatedAt`
    });
};
