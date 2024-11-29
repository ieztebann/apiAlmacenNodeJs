module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: {type : DataTypes.STRING, field: 'nombre'}
    }, {
        tableName: 'products',
        schema: 'almacen',
        timestamps: false
    });
};