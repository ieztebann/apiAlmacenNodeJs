const bcrypt = require('bcryptjs');
const { Vehicle } = require('../../../models'); // Importa tus modelos de Sequelize

/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Vehicle creado o actualizado.
 */
const fillVehicle = async (datosVehiculo) => {
    let product;
    try {    
        const productData = {
            product_detail_id: datosVehiculo.VehicleId ? product.id : null,
            cantidad: datosVehiculo.Quantity ? (datosVehiculo.Quantity) : null,
            valor_unitario: datosVehiculo.Price ? (datosVehiculo.Price) : null, 
            valor_total: datosVehiculo.Total ? (datosVehiculo.Total) : null,
            valor_neto: datosVehiculo.Subtotal ? (datosVehiculo.Subtotal) : null,
            valor_descuento: datosVehiculo.Discunt ? (datosVehiculo.Discunt) : 0.00,
            valor_impuesto: datosVehiculo.Iva ? (datosVehiculo.Iva) : 0.00,
            valor_venta: datosVehiculo.Price ? (datosVehiculo.Price) : null,
            iva_descontable: 0.00,                        
            valor_compra: datosVehiculo.Price ? (datosVehiculo.Price) : null,
            valor_descuento_sin_imp: 0.00,
            valor_descuento_con_imp: 0,
            porcentaje_descuento: 0,
            total_impuesto: datosVehiculo.Iva ? (datosVehiculo.Iva) : 0.00,
            valor_venta_product: datosVehiculo.Price ? (datosVehiculo.Price) : null
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la producto.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosVehiculo - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateVehicle = async (datosVehiculo) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{1,3})?$/;
            
        /* VehicleId */
        if (!datosVehiculo.product_detail_id) {
            throw new Error('Debe completar el identificador del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosVehiculo.product_detail_id)) {
            throw new Error('El identificador no es valido.');                                                                                                                    
        }         
        /* Cantidad */
        if (!datosVehiculo.cantidad) {
            throw new Error('Debe completar la cantidad del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosVehiculo.cantidad)) {
            throw new Error('La cantidad no es valida.');                                                                                                                    
        }         
        /* Precio */ 
        if (!datosVehiculo.valor_unitario) {
            throw new Error('Debe completar el Precio del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosVehiculo.valor_unitario)) {
            throw new Error('El Precio no es valido.');                                                                                                                    
        }         
        /* Descuento */ 
        if (!regexThreeDecimals.test(datosVehiculo.valor_descuento)) {
            throw new Error('El Descuento no es valido.');                                                                                                                    
        }         
        /* Iva */  
        if (!regexThreeDecimals.test(datosVehiculo.valor_impuesto)) {
            throw new Error('El Iva no es valido.');                                                                                                                    
        }             
        /* Subtotal */ 
        if (!datosVehiculo.valor_neto) {
            throw new Error('Debe completar el Subtotal del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosVehiculo.valor_neto)) {
            throw new Error('El Subtotal no es valido.');                                                                                                                    
        }                    
        /* Total */ 
        if (!datosVehiculo.valor_total) {
            throw new Error('Debe completar el Total del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosVehiculo.valor_total)) {
            throw new Error('El Total no es valido.');                                                                                                                    
        }           
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillVehicle, validateVehicle };
