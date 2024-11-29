module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProductDetails', {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true,
        },
        name: {type : DataTypes.STRING, field: 'nombre'}
    }, {
        tableName: 'product_details',
        schema: 'almacen',
        timestamps: false
    });
};