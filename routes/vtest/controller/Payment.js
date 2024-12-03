const bcrypt = require('bcryptjs');
const { PaymentFormInventories } = require('../../../models'); // Importa tus modelos de Sequelize
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Payment creado o actualizado.
 */
const fillPayment = async (PaymentInformation) => {
    try {
        const productData = {
            payment_form_inventory_id: PaymentInformation.PaymentFormId ? PaymentInformation.PaymentFormId : null,
            payment_method_inventory_id: PaymentInformation.PaymentMethodId ? PaymentInformation.PaymentMethodId : null,
            id_tarjeta_banco: PaymentInformation.CardId ? PaymentInformation.CardId : null,
            nro_transaccion: PaymentInformation.TransaccionNumber ? PaymentInformation.TransaccionNumber : null
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la informacion de pago.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosVehiculo - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validatePayment = async (paymentData) => {
    try {        
        /* Validation With Regex */
        const regexNumeric = /^[0-9]+$/;
        /* payment_form_inventory_id */
        if (!paymentData.payment_form_inventory_id) {
            throw new Error('Debe completar la forma de pago.');                                                                                                                    
        }
        if (!regexNumeric.test(paymentData.payment_form_inventory_id)) {
            throw new Error('La forma de pago es invalida.');                                                                                                                   
        }
        /* payment_method_inventory_id */        
        if (!paymentData.payment_method_inventory_id) {       
            throw new Error('Debe completar el medio de pago.');                                                                                                                                
        }
        if (!regexNumeric.test(paymentData.payment_method_inventory_id)) {
            throw new Error('El medio de pago es invalida.');                                                                                                                   
            
        }  
        return true;
    } catch (error) {
        throw new Error(error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} personData - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const getPayment = async (paymentData) => {
    try {
        const currentPaymentForm = await PaymentFormInventories.findOne({
            where: {
                id: paymentData.payment_form_inventory_id
            }
        });
        if(!currentPaymentForm){
            throw new Error('Forma de pago invalida');            
        }

        return {currentPaymentForm:currentPaymentForm};
    } catch (error) {
        throw new Error('Error al encontrar informacion de pago. ('+error+')');
    }
};
module.exports = { fillPayment, validatePayment, getPayment};
