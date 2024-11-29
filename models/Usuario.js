module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        id: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_usuario'},
        name: {type : DataTypes.STRING, field: 'nom_usuario'},
        password: {type : DataTypes.STRING, field: 'password'}
    }, {
        tableName: 'tb_usuario',
        schema: 'public',
        timestamps: false
    });
};