module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Credito', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id_credito_generado',
            autoIncrement: true,
        },
        idEstCreditoGenerado: {
            type: DataTypes.INTEGER,
            field: 'id_est_credito_generado',
            defaultValue: 1,
        },
        idEmpresaOperadora: {
            type: DataTypes.INTEGER,
            field: 'id_empresa_operadora',
        },
        idPersona: {
            type: DataTypes.INTEGER,
            field: 'id_persona',
        },
        idVehiculo: {
            type: DataTypes.INTEGER,
            field: 'id_vehiculo',
        },
        idConceptoComprobante: {
            type: DataTypes.INTEGER,
            field: 'id_concepto_comprobante',
        },
        idPeriodoAplicaCredito: {
            type: DataTypes.INTEGER,
            field: 'id_periodo_aplica_credito',
            defaultValue: 1,
        },
        fecDesembolso: {
            type: DataTypes.DATE,
            field: 'fec_desembolso',
        },
        fecPrimeraCuota: {
            type: DataTypes.DATEONLY,
            field: 'fec_primera_cuota',
        },
        monto: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'monto',
            defaultValue: 0,
        },
        cantCuotas: {
            type: DataTypes.DECIMAL(10, 0),
            field: 'cant_cuotas',
        },
        tasaInteres: {
            type: DataTypes.DECIMAL(5, 2),
            field: 'tasa_interes',
            defaultValue: 0,
        },
        tasaInteresMora: {
            type: DataTypes.DECIMAL(10, 0),
            field: 'tasa_interes_mora',
        },
        idFormaAplicaSeguro: {
            type: DataTypes.INTEGER,
            field: 'id_forma_aplica_seguro',
        },
        tarifaSeguro: {
            type: DataTypes.DECIMAL(10, 3),
            field: 'tarifa_seguro',
            defaultValue: 0,
        },
        idFormaPagoCredito: {
            type: DataTypes.INTEGER,
            field: 'id_forma_pago_credito',
        },
        diasMora: {
            type: DataTypes.DECIMAL(10, 0),
            field: 'dias_mora',
        },
        arrCodeudores: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            field: 'arr_codeudores',
        },
        idUsuarioCre: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_cre',
        },
        fecCre: {
            type: DataTypes.DATE,
            field: 'fec_cre',
            defaultValue: sequelize.literal("(substr((now())::text, 0, 20))::timestamp without time zone"),
        },
        idUsuarioMod: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_mod',
        },
        fecMod: {
            type: DataTypes.DATE,
            field: 'fec_mod',
        },
        observacion: {
            type: DataTypes.TEXT,
            field: 'observacion',
        },
        saldoActual: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'saldo_actual',
        },
        nroPagare: {
            type: DataTypes.STRING(50),
            field: 'nro_pagare',
        },
        requierePagare: {
            type: DataTypes.BOOLEAN,
            field: 'requiere_pagare',
        },
        razonModificacion: {
            type: DataTypes.TEXT,
            field: 'razon_modificacion',
        },
    }, {
        tableName: 'tb_credito_generado',
        schema: 'public',
        timestamps: false,
    });
};
