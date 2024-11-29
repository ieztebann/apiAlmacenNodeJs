module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Sucursal', {
        id: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_sucursal'},
        name: {type : DataTypes.STRING, field: 'nom_sucursal'}
    }, {
        tableName: 'tb_sucursal',
        schema: 'public',
        timestamps: false
    });
};