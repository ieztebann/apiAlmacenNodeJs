module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Persona', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            field: 'id_persona',
            autoIncrement: true // Indica que es un serial
        },
        nombre: { 
            type: DataTypes.STRING, 
            field: 'nombre' 
        },
        nro_identificacion: { 
            type: DataTypes.STRING,  // O ajusta el tipo de dato según sea necesario
            field: 'nro_identificacion'  // Nombre del campo en la tabla de la base de datos
        },
        id_tipo_persona: {
            type: DataTypes.INTEGER,
            field: 'id_tipo_persona'
        },
        id_tipo_doc_identificacion: {
            type: DataTypes.INTEGER,
            field: 'id_tipo_doc_identificacion'
        },
        primer_apellido: {
            type: DataTypes.STRING,
            field: 'primer_apellido'
        },
        segundo_apellido: {
            type: DataTypes.STRING,
            field: 'segundo_apellido'
        },
        dir: {
            type: DataTypes.STRING,
            field: 'dir'
        },
        celular: {
            type: DataTypes.STRING,
            field: 'celular'
        },
        tel_fijo: {
            type: DataTypes.STRING,
            field: 'tel_fijo'
        },
        e_mail: {
            type: DataTypes.STRING,
            field: 'e_mail'
        },
        id_usuario_mod: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_mod'
        },
        id_usuario_cre: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_cre'
        },
        fec_cre: {
            type: DataTypes.DATE,
            field: 'fec_cre'
        },
        fec_mod: {
            type: DataTypes.DATE,
            field: 'fec_mod'
        }
    }, {
        tableName: 'tb_persona',
        schema: 'public',
        timestamps: false
    });
};
