module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProductDetails', {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: {type : DataTypes.STRING, field: 'nombre'}
    }, {
        tableName: 'product_details',
        schema: 'almacen',
        timestamps: false
    });
};