const bcrypt = require('bcryptjs');
const { Product, ProductDetails } = require('../../../models'); // Importa tus modelos de Sequelize
const sequelize = require('../../../config/database');

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosProducto - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const getProduct = async (ProductId) => {
    try {
        const currentProductDetail = await ProductDetails.findOne({
            where: {
                id: ProductId
            },
            attributes: ['id'] 
        });
        if (!currentProductDetail) {
            throw new Error('Producto no permitido.');            
        }
        return currentProductDetail;
    } catch (error) {
        throw new Error('Se presentó un problema al consultar el producto. ('+error+')');
    }
};
const getProductValues = async (idSucursal, productId) => {
    try {
        // Llamada a la función PostgreSQL
        const query = `
            SELECT * FROM almacen.pl_get_valor_producto_x_sucursal(:idSucursal, :productId, '0') 
            AS (
                valor_costo text,
                porcentaje_utilidad text,
                valor_utilidad text,
                id_iva_compra text,
                id_iva_venta text,
                porcentaje_iva_compra text,
                porcentaje_iva_venta text,
                valor_iva_compra text,
                valor_iva_venta text,
                valor_venta text,
                utility_type_id text,
                valor_venta_uni_product_incl_iva text
            );
        `;

        const [result] = await sequelize.query(query, {
            replacements: {
                idSucursal: idSucursal,
                productId: productId
            },
            type: sequelize.QueryTypes.SELECT
        });

        if (!result) {
            throw new Error('No se encontro valores del producto.');            
        }
        return {
            valor_costo: result.valor_costo,
            porcentaje_utilidad: result.porcentaje_utilidad,
            valor_utilidad: result.valor_utilidad,
            id_iva_compra: result.id_iva_compra,
            id_iva_venta: result.id_iva_venta,
            porcentaje_iva_compra: result.porcentaje_iva_compra,
            porcentaje_iva_venta: result.porcentaje_iva_venta,
            valor_iva_compra: result.valor_iva_compra,
            valor_iva_venta: result.valor_iva_venta,
            valor_venta: result.valor_venta,
            utility_type_id: result.utility_type_id,
            valor_venta_uni_product_incl_iva: result.valor_venta_uni_product_incl_iva,
        };

    } catch (error) {
        console.error(error);
        throw new Error('Se presentó un problema al consultar el producto. ('+error+')');
    }
};

/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const fillProduct = async (datosProducto,idSucursal) => {
    let product;
    let valorVentaProc = 0;
    let valorUtilidad = 0;
    let valorCompraProc = 0;
    let cantidad = 0;
    let totalCompraProc = 0;
    let valorNeto = 0;
    let porcentajeImpuesto = 0;
    let idIva = 0;

    if(datosProducto.ProductId ){
        product = await getProduct(datosProducto.ProductId);            
        productValues = await getProductValues(idSucursal,product.id);    

        cantidad = datosProducto.Quantity ? (datosProducto.Quantity) : null;
        valorVentaProc = productValues.valor_venta;
        valorUtilidad = productValues.valor_utilidad;
        valorCompraProc = productValues.valor_costo;
        totalCompraProc = valorCompraProc * cantidad;
        valorNeto = valorVentaProc * cantidad;
        porcentajeImpuesto = productValues.porcentaje_iva_compra;
        idIva = productValues.id_iva_compra;
        valorImpU = (valorVentaProc * porcentajeImpuesto) / 100;
        valorTotal = valorNeto + valorImpU;
        valorImpuestoP = valorImpU * cantidad;
        valorImpComp = productValues.valor_iva_venta;
        ivaDescontable = valorImpU - valorImpComp;
        totalImpuestoU = (valorVentaProc * porcentajeImpuesto) / 100;

    }
    
    try {    
        const productData = {
            productDetailId: datosProducto.ProductId ? product.id : null,//listo
            cantidad: datosProducto.Quantity ? (datosProducto.Quantity) : null,//listo
            valorTotal: valorTotal ? (valorTotal) : null,//listo
            valorDescuento: datosProducto.Discunt ? (datosProducto.Discunt) : 0.00,//listo
            valorImpuesto: valorImpuestoP ? (valorImpuestoP) : 0.00,//listo
            tarifaIva: porcentajeImpuesto ? (porcentajeImpuesto) : 0.00,//listo
            ivaDescontable: ivaDescontable ? (ivaDescontable) : 0.00,//listo
            ivaRateId: idIva ? (idIva) : null,//listo
            valorNeto: valorNeto ? (valorNeto) : null,//listo
            valorUnitario: valorVentaProc ? ( Number(parseFloat(valorVentaProc).toFixed(3))) : null,//listo 
            valorCompra: valorCompraProc ? (valorCompraProc) : null,//listo
            valorCompraProduct: valorCompraProc ? (valorCompraProc) : null,//listo
            totalCompra: valorCompraProc && datosProducto.Quantity ? (valorCompraProc * datosProducto.Quantity) : null,//listo
            valorUtilidadProduct: valorUtilidad ? (valorUtilidad) : null,//listo
            totalUtilidad: valorUtilidad && datosProducto.Quantity ? (valorUtilidad * datosProducto.Quantity) : null,//listo
            valorVenta: valorVentaProc ? (valorVentaProc) : null,//listo
            valorVentaProduct: valorVentaProc ? (valorVentaProc) : null,//listo
            valorDescuentoSinImp: 0.00,
            valorDescuentoConImp: 0,
            porcentajeDescuento: 0,
            porcentajeUtilidadProduct: 0,
            totalImpuesto: totalImpuestoU ? (totalImpuestoU) : 0.00
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la producto.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosProducto - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateProduct = async (datosProducto) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{1,3})?$/;
        /* ProductId */
        if (!datosProducto.productDetailId) {
            throw new Error('Debe completar el identificador del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosProducto.productDetailId)) {
            throw new Error('El identificador no es valido.');                                                                                                                    
        }         
        /* Cantidad */
        if (!datosProducto.cantidad) {
            throw new Error('Debe completar la cantidad del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.cantidad)) {
            throw new Error('La cantidad no es valida.');                                                                                                                    
        }         
        /* Precio */ 
        if (!datosProducto.valorUnitario) {
            throw new Error('(Almacen) No hay Entrada de Inventario registrada, no existe precio para el Producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valorUnitario)) {
            throw new Error('(Almacen) No hay Entrada de Inventario registrada, precio para el Producto invalido. '+datosProducto.valorUnitario);                                                                                                                    

        }         
        /* Descuento */ 
        if (!regexThreeDecimals.test(datosProducto.valorDescuento)) {
            throw new Error('El Descuento no es valido.');                                                                                                                    
        }         
        /* Iva */  
        if (!regexThreeDecimals.test(datosProducto.valorImpuesto)) {
            throw new Error('El Iva no es valido.');                                                                                                                    
        }             
        /* Subtotal */ 
        if (!datosProducto.valorNeto) {
            throw new Error('No se encontró el valor Neto del producto (Verifique la configuracion del producto).');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valorNeto)) {
            throw new Error('El Valor Neto no es valido.');                                                                                                                    
        }                    
        /* Total */ 
        if (!datosProducto.valorTotal) {
            throw new Error('No se encontró el valor Total del producto (Verifique la configuracion del producto).');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valorTotal)) {
            throw new Error('El Valor Total no es valido.');                                                                                                                    
        }           
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillProduct, validateProduct };
