const bcrypt = require('bcryptjs');
const { ProductDetails, EmpresaSistema, Output } = require('../../../models'); // Importa tus modelos de Sequelize
const { getEmpresaSistema } = require('./EmpresaSistema');
const { fillCredit } = require('./Credit');
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const fillOutput = async (currentPerson,productData,objVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario, creditData,datosEstacion) => {
    let product;
    const id_empresa_operadora = await getEmpresaSistema();
    if(currentPerson.ProductId ){
        product = await getProduct(currentPerson.ProductId);
    }
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'
    try {
        const OutputData = {
            id: outputId,
            output_inventory_type_id: 1,
            payment_form_inventory_id: currentPayment.currentPaymentForm.id ? currentPayment.currentPaymentForm.id : null, 
            inventory_output_state_id: 2,
            inventory_type_billing_id: currentPayment.currentPaymentForm.id === 3 ? 4 : 3,
            id_persona: currentPerson.id ? currentPerson.id : null,
            observacion: InvoiceInformation.Details ? InvoiceInformation.Details : null,
            dispenser_number: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            prefijo: InvoiceInformation.PosPrefix ? InvoiceInformation.PosPrefix : null,
            kilometros_veh: objVehicle && objVehicle.currentFormVehicle && objVehicle.currentFormVehicle && objVehicle.currentFormVehicle.Mileage ? objVehicle.currentFormVehicle.Mileage : null,
            fecha_ultimo_mantenimiento: objVehicle && objVehicle.currentFormVehicle && objVehicle.currentFormVehicle.LastMaintenanceDate ? objVehicle.currentFormVehicle.LastMaintenanceDate : null,
            surtidor: datosEstacion && datosEstacion.Dispenser ? datosEstacion.Dispenser : null,
            isla: datosEstacion && datosEstacion.Island ? datosEstacion.Island : null,
            manguera: datosEstacion && datosEstacion.Hose ? datosEstacion.Hose : null,
            nro_cruce: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            prefijo_cruce: InvoiceInformation.PosPrefix ? InvoiceInformation.PosPrefix : null,
            external_vehicle_id: objVehicle && objVehicle.currentExternalVehicle && objVehicle.currentExternalVehicle && objVehicle.currentExternalVehicle.id ? objVehicle.currentExternalVehicle.id : null,
            id_vehiculo: objVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle.id ? objVehicle.currentVehicle.id : null,
            fecha_cobro: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            fec_mov: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            id_tarjeta_banco: currentPayment.id_tarjeta_banco ? currentPayment.id_tarjeta_banco : null,
            nro_transaccion: currentPayment.nro_transaccion ? currentPerson.nro_transaccion : null,            
            valor_total: productData.valor_total ? productData.valor_total : null,
            valor_neto: productData.valor_neto ? productData.valor_neto : null,
            valor_impuesto: productData.valor_impuesto ? productData.valor_impuesto : null,
            valor_descuento: productData.valor_descuento ? productData.valor_descuento : null,
            valor_abono: 0,
            saldo_actual: productData.valor_total ? productData.valor_total : null,
            valor_neto_sin_imp: productData.valor_neto ? productData.valor_neto : null,
            porcentaje_descuento: 0,
            valor_descuento_sin_imp: productData.valor_impuesto > 0 ? 0 : productData.valor_descuento,
            valor_descuento_con_imp: productData.valor_impuesto > 0 ? productData.valor_descuento : 0,
            total_impuesto: productData.valor_impuesto ? productData.valor_impuesto : 0,
            valor_credito: currentPayment.currentPaymentForm.id === 3 ? (productData.valor_total ? productData.valor_total : null) : 0,
            id_sucursal: idSucursal ? idSucursal : null,
            id_usuario_cre: idUsuario ? idUsuario : null,
            software_externo: true,
            id_empresa_operadora: id_empresa_operadora.idPersona ? (id_empresa_operadora.idPersona) : null
        };
        return OutputData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la salida.'+error);
    }
};


/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosCredito - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateOutput = async (datosCredito) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{1,3})?$/;

        /* id */
        if (!datosCredito.id) {
            throw new Error('Identificador de la factura se generó incorrectamente.');
        }
        if (!regexNumeric.test(datosCredito.id)) {
            throw new Error('El identificador no es valido.');
        }
        /* Type */
        if (!datosCredito.output_inventory_type_id) {
            throw new Error('Tipo de Identificador de la factura se generó incorrectamente.');
        }
        if (!regexNumeric.test(datosCredito.output_inventory_type_id)) {
            throw new Error('El tipo de identificador no es valido.');
        }
        /* Type */
        if (!datosCredito.payment_form_inventory_id) {
            throw new Error('Tipo de Identificador de la factura se generó incorrectamente.');
        }
        if (!regexNumeric.test(datosCredito.payment_form_inventory_id)) {
            throw new Error('El tipo de identificador no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.inventory_output_state_id) {
            throw new Error('Estado invalido de la factura.');
        }
        if (!regexNumeric.test(datosCredito.inventory_output_state_id)) {
            throw new Error('El Precio no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.inventory_type_billing_id) {
            throw new Error('El tipo de facturacion no es valido.');
        }
        if (!regexNumeric.test(datosCredito.inventory_type_billing_id)) {
            throw new Error('El tipo de facturacion no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.id_persona) {
            throw new Error('La persona no es valida.');
        }
        if (!regexNumeric.test(datosCredito.id_persona)) {
            throw new Error('La persona no es valida.');
        }
        /* Precio */ 
        if (!datosCredito.id_empresa_operadora) {
            throw new Error('La persona no es valida.');
        }
        if (!regexNumeric.test(datosCredito.id_empresa_operadora)) {
            throw new Error('La empresa operadora no es valida.');
        }
        /* Precio */ 
        if (!datosCredito.observacion) {
            throw new Error('Debe completar la observacion de la factura.');
        }
        /* Precio */ 
        if (!datosCredito.prefijo) {
            throw new Error('Debe completar el prefijo pos de la factura.');
        }
        /*Precio*/
        if (!datosCredito.fecha_cobro) {
            throw new Error('Debe completar la fecha de la factura.');
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} outputData - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const createOutput = async (outputData, idUsuario, dbDate, transaction) => {
    try {
        outputData.id_usuario_cre = idUsuario;
        outputData.createdAt = dbDate;
        updatedPerson = await Output.create(outputData,{ transaction });
        return updatedPerson;
    } catch (error) {
        throw new Error('Error al gestionar la factura. ('+error+')');
    }
};
module.exports = { fillOutput, validateOutput, createOutput };
