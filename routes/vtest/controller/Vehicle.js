const bcrypt = require('bcryptjs');
const { Vehicle } = require('../../../models'); // Importa tus modelos de Sequelize

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosProducto - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const getVehicle = async (Plate) => {
    try {
        const currentProductDetail = await Vehicle.findOne({
            where: {
                placa: Plate
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
 * @returns {Promise<Object>} - Retorna el objeto Vehicle creado o actualizado.
 */
const fillVehicle = async (datosVehiculo) => {
    let vehicle;
    if(datosVehiculo.Plate ){
        vehicle = await getVehicle(datosVehiculo.Plate);            
    }
    try {    
        const productData = {
            id_vehiculo: datosVehiculo.Plate ? datosVehiculo.Plate : null,
            placa: datosVehiculo.Plate ? datosVehiculo.Plate : null,
            fecha_ultimo_mantenimiento: datosVehiculo.LastMaintenanceDate ? datosVehiculo.LastMaintenanceDate : null,
            fecha_siguiente_mantenimiento: datosVehiculo.NextMaintenanceDate ? datosVehiculo.NextMaintenanceDate : null,
            kilometros_veh: datosVehiculo.Mileage ? datosVehiculo.Mileage : null
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
