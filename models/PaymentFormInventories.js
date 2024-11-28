module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PaymentFormInventories', {
        id: { type: DataTypes.INTEGER, primaryKey: true},
        name: {type : DataTypes.STRING, field: 'nombre'}
    }, {
        tableName: 'payment_form_inventories',
        schema: 'almacen',
        timestamps: false
    });
};