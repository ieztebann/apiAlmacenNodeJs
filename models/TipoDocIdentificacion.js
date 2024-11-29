module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TipoDocIdentificacion', {
        id: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_tipo_doc_identificacion'},
        name: {type : DataTypes.STRING, field: 'nom_tipo_doc_identificacion'}
    }, {
        tableName: 'tb_tipo_doc_identificacion',
        schema: 'public',
        timestamps: false
    });
};