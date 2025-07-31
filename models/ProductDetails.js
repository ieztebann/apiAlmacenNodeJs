module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProductDetails', {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true,
        },
        name: {type : DataTypes.STRING, field: 'nombre'},
        cod_product: {type : DataTypes.STRING, field: 'cod_product'},
        register_status_id: { type: DataTypes.INTEGER, field: 'id_est_registro'},

    }, {
        tableName: 'product_details',
        schema: 'almacen',
        timestamps: false
    });
};