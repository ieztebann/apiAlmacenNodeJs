const bcrypt = require('bcryptjs');
const { Vehicle, ExternalVehicle } = require('../../../models'); // Importa tus modelos de Sequelize
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosVehiculo - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const manageVehicle = async (datosVehiculo, idPersona, idUsuario, transaction) => {
    let currentVehicle;
    let currentExternalVehicle;
    let currentFormVehicle = datosVehiculo;
    try {
        currentVehicle = await Vehicle.findOne({
            where: {
                placa: datosVehiculo.plate
            },
            attributes: ['id'], 
            transaction 
        });
        if (!currentVehicle) {
            currentExternalVehicle = await ExternalVehicle.findOne({
                where: {
                    plate: datosVehiculo.plate
                },
                attributes: ['id'], 
                transaction  
            });
        }
        if (!currentExternalVehicle) {
            currentExternalVehicle = await ExternalVehicle.create({"plate":datosVehiculo.plate,"idPersonaPropietario":idPersona,"idUsuarioCre":idUsuario, "observacion":"Vehiculo EDS Facturacion"},{ transaction });
        }
        
        return { currentVehicle, currentExternalVehicle, currentFormVehicle };
    } catch (error) {
        throw new Error('Error al gestionar el vehiculo. ('+error+')');
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
    try {
        const productData = {
            plate: datosVehiculo.Plate ? datosVehiculo.Plate : null,
            fecha_ultimo_mantenimiento: datosVehiculo.LastMaintenanceDate ? datosVehiculo.LastMaintenanceDate : null,
            fecha_siguiente_mantenimiento: datosVehiculo.NextMaintenanceDate ? datosVehiculo.NextMaintenanceDate : null,
            kilometros_veh: datosVehiculo.Mileage ? datosVehiculo.Mileage : null
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la vehiculo.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosVehiculo - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateVehicle = async (datosVehiculo) => {
    try {        
        /* Vehicle */
        if (!datosVehiculo.plate) {
            throw new Error('Debe completar la placa del vehiculo.');                                                                                                                    
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillVehicle, validateVehicle, manageVehicle };
