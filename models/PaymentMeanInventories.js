module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PaymentMeanInventories', {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: {type : DataTypes.STRING, field: 'nombre'},
        payment_method_inventory_id: {type : DataTypes.STRING, field: 'payment_method_inventory_id'}
    }, {
        tableName: 'payment_means_inventories',
        schema: 'almacen',
        timestamps: false
    });
};