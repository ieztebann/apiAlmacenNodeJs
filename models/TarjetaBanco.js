module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TarjetaBanco', {
        id: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_tarjeta_banco' },
        name: {type : DataTypes.STRING, field: 'nombre'},
    }, {
        tableName: 'tb_tarjeta_banco',
        schema: 'public',
        timestamps: false
    });
};