module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OutputInventoryDetail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        outputInventoryId: {
            type: DataTypes.INTEGER,
            field: 'output_inventory_id',
            allowNull: false,
        },
        productDetailId: {
            type: DataTypes.INTEGER,
            field: 'product_detail_id',
        },
        cantidad: {
            type: DataTypes.DECIMAL(20, 3),
            allowNull: false,
        },
        valorUnitario: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_unitario',
            allowNull: false,
        },
        valorTotal: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_total',
            allowNull: false,
        },
        valorDescuento: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_descuento',
            allowNull: false,
        },
        valorImpuesto: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_impuesto',
            allowNull: false,
        },
        valorNeto: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_neto',
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
        },
        idEstRegistro: {
            type: DataTypes.INTEGER,
            field: 'id_est_registro',
            defaultValue: 1,
        },
        valorVenta: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_venta',
            allowNull: false,
        },
        valorCompra: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_compra',
            allowNull: false,
        },
        ivaDescontable: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'iva_descontable',
            allowNull: false,
        },
        tarifaIva: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'tarifa_iva',
            allowNull: false,
        },
        porcentajeUtilidadProduct: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'porcentaje_utilidad_product',
            allowNull: false,
        },
        valorCompraProduct: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_compra_product',
            allowNull: false,
        },
        valorVentaProduct: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_venta_product',
            allowNull: false,
        },
        valorUtilidadProduct: {
            type: DataTypes.DECIMAL(20, 5),
            field: 'valor_utilidad_product',
            allowNull: false,
        },
        ivaRateId: {
            type: DataTypes.INTEGER,
            field: 'iva_rate_id',
            allowNull: false,
        },
        totalCompra: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'total_compra',
            allowNull: false,
        },
        totalUtilidad: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'total_utilidad',
            allowNull: false,
        },
        porcentajeDescuento: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'porcentaje_descuento',
            allowNull: false,
        },
        valorDescuentoSinImp: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_descuento_sin_imp',
            allowNull: false,
        },
        valorDescuentoConImp: {
            type: DataTypes.DECIMAL(20, 0),
            field: 'valor_descuento_con_imp',
            allowNull: false,
        },
        totalImpuesto: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'total_impuesto',
            allowNull: false,
        },
        workTypeId: {
            type: DataTypes.INTEGER,
            field: 'work_type_id',
        },
        idPersonaResponsable: {
            type: DataTypes.INTEGER,
            field: 'id_persona_responsable',
        },
        maintenanceTypeId: {
            type: DataTypes.INTEGER,
            field: 'maintenance_type_id',
        },
        utilityTypeId: {
            type: DataTypes.INTEGER,
            field: 'utility_type_id',
            defaultValue: 1,
        },
        valorVentaUniProductInclIva: {
            type: DataTypes.DECIMAL,
            field: 'valor_venta_uni_product_incl_iva',
            defaultValue: 0,
        },
        valorUnitarioApi: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'valor_unitario_api',
            allowNull: false,
        },
        cantidadApi: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'cantidad_api',
            allowNull: false,
        },
        valorTotalApi: {
            type: DataTypes.DECIMAL(20, 2),
            field: 'total_api',
            allowNull: false,
        },
    }, {
        tableName: 'output_inventory_details',
        schema: 'almacen',
        timestamps: false,
    });
};
