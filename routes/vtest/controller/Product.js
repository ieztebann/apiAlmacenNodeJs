const bcrypt = require('bcryptjs');
const { Product, ProductDetails } = require('../../../models'); // Importa tus modelos de Sequelize

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
        throw new Error('Error al consultar el producto. ('+error+')');
    }
};
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const fillProduct = async (datosProducto) => {
    let product;
    if(datosProducto.ProductId ){
        product = await getProduct(datosProducto.ProductId);            
    }
    
    try {    
        const productData = {
            product_detail_id: datosProducto.ProductId ? product.id : null,
            cantidad: datosProducto.Quantity ? (datosProducto.Quantity) : null,
            valor_unitario: datosProducto.Price ? (datosProducto.Price) : null, 
            valor_total: datosProducto.Total ? (datosProducto.Total) : null,
            valor_neto: datosProducto.Subtotal ? (datosProducto.Subtotal) : null,
            valor_descuento: datosProducto.Discunt ? (datosProducto.Discunt) : 0.00,
            valor_impuesto: datosProducto.Iva ? (datosProducto.Iva) : 0.00,
            valor_venta: datosProducto.Price ? (datosProducto.Price) : null,
            iva_descontable: 0.00,                        
            valor_compra: datosProducto.Price ? (datosProducto.Price) : null,
            valor_descuento_sin_imp: 0.00,
            valor_descuento_con_imp: 0,
            porcentaje_descuento: 0,
            total_impuesto: datosProducto.Iva ? (datosProducto.Iva) : 0.00,
            valor_venta_product: datosProducto.Price ? (datosProducto.Price) : null
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
        if (!datosProducto.product_detail_id) {
            throw new Error('Debe completar el identificador del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosProducto.product_detail_id)) {
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
        if (!datosProducto.valor_unitario) {
            throw new Error('Debe completar el Precio del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valor_unitario)) {
            throw new Error('El Precio no es valido.');                                                                                                                    
        }         
        /* Descuento */ 
        if (!regexThreeDecimals.test(datosProducto.valor_descuento)) {
            throw new Error('El Descuento no es valido.');                                                                                                                    
        }         
        /* Iva */  
        if (!regexThreeDecimals.test(datosProducto.valor_impuesto)) {
            throw new Error('El Iva no es valido.');                                                                                                                    
        }             
        /* Subtotal */ 
        if (!datosProducto.valor_neto) {
            throw new Error('Debe completar el Subtotal del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valor_neto)) {
            throw new Error('El Subtotal no es valido.');                                                                                                                    
        }                    
        /* Total */ 
        if (!datosProducto.valor_total) {
            throw new Error('Debe completar el Total del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosProducto.valor_total)) {
            throw new Error('El Total no es valido.');                                                                                                                    
        }           
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillProduct, validateProduct };
