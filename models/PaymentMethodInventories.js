module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PaymentMethodInventories', {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: {type : DataTypes.STRING, field: 'nombre'},
        payment_form_inventory_id: {type : DataTypes.STRING, field: 'payment_form_inventory_id'}
    }, {
        tableName: 'payment_methods_inventories',
        schema: 'almacen',
        timestamps: false
    });
};