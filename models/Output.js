module.exports = (sequelize, DataTypes) => {
    return sequelize.define('InventoryOutput', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        outputInventoryTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'output_inventory_type_id'
        },
        paymentFormInventoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'payment_form_inventory_id'
        },
        inventoryTypeBillingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'inventory_type_billing_id'
        },
        inventoryOutputStateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'inventory_output_state_id'
        },
        idSucursal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_sucursal'
        },
        prefijo: {
            type: DataTypes.STRING(20),
            field: 'prefijo'
        },
        numero: {
            type: DataTypes.STRING(20),
            field: 'numero'
        },
        idPersona: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_persona'
        },
        idVehiculo: {
            type: DataTypes.INTEGER,
            field: 'id_vehiculo'
        },
        fecMov: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("NOW()"),
            field: 'fec_mov'
        },
        fechaCobro: {
            type: DataTypes.DATE,
            field: 'fecha_cobro'
        },
        valorTotal: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_total'
        },
        valorAbono: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_abono'
        },
        valorDescuento: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_descuento'
        },
        totalImpuesto: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'total_impuesto'
        },
        valorNeto: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_neto'
        },
        valorImpuesto: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_impuesto'
        },
        valorDescuentoSinImp: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_descuento_sin_imp'
        },
        valorDescuentoConImp: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_descuento_con_imp'
        },
        saldoActual: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'saldo_actual'
        },
        observacion: {
            type: DataTypes.TEXT,
            field: 'observacion'
        },
        resolucion: {
            type: DataTypes.TEXT,
            field: 'resolucion'
        },
        idUsuarioCre: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_usuario_cre'
        },
        idUsuarioMod: {
            type: DataTypes.INTEGER,
            field: 'id_usuario_mod'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updated_at'
        },
        razonModificacion: {
            type: DataTypes.TEXT,
            field: 'razon_modificacion'
        },
        idEmpresaOperadora: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_empresa_operadora'
        },
        valorNetoSinImp: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            field: 'valor_neto_sin_imp'
        },
        porcentajeDescuento: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            field: 'porcentaje_descuento'
        },
        idTarjetaBanco: {
            type: DataTypes.INTEGER,
            field: 'id_tarjeta_banco'
        },
        nroTransaccion: {
            type: DataTypes.TEXT,
            field: 'nro_transaccion'
        },
        softwareExterno: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'software_externo'
        },
        externalVehicleId: {
            type: DataTypes.INTEGER,
            field: 'external_vehicle_id'
        },
        dispenserNumber: {
            type: DataTypes.STRING,
            field: 'dispenser_number'
        },
        surtidor: {
            type: DataTypes.STRING,
            field: 'surtidor'
        },
        isla: {
            type: DataTypes.STRING,
            field: 'isla'
        },
        manguera: {
            type: DataTypes.STRING,
            field: 'manguera'
        },
        nroCruce: {
            type: DataTypes.STRING,
            field: 'nro_cruce'
        },
        prefijoCruce: {
            type: DataTypes.STRING,
            field: 'prefijo_cruce'
        },
        kilometrosVeh: {
            type: DataTypes.STRING,
            field: 'kilometros_veh'
        },
        valorCredito: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            field: 'valor_credito'
        }
    }, {
        tableName: 'inventory_outputs',
        schema: 'almacen',
        timestamps: false,
        underscored: true
    });
};
