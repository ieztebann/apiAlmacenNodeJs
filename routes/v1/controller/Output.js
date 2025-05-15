const bcrypt = require('bcryptjs');
const { ProductDetails, EmpresaSistema, Output, OutputInventoryDetail } = require('../../../models'); // Importa tus modelos de Sequelize
const { getEmpresaSistema } = require('./EmpresaSistema');
const { fillCredit } = require('./Credit');
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const fillOutput = async (currentPerson,productData,objVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario,datosEstacion) => {
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
            outputInventoryTypeId: 1,
            paymentFormInventoryId: currentPayment.currentPaymentForm.id ? currentPayment.currentPaymentForm.id : null, 
            paymentMethodInventoryId: currentPayment.currentPaymentMethod.id ? currentPayment.currentPaymentMethod.id : null, 
            paymentMeanInventoryId: currentPayment.currentPaymentMean.id ? currentPayment.currentPaymentMean.id : null, 
            inventoryOutputStateId: 2,
            inventoryTypeBillingId: 3,
            idPersona: currentPerson.id ? currentPerson.id : null,
            observacion: InvoiceInformation.Details ? InvoiceInformation.Details : null,
            dispenserNumber: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            kilometrosVeh: objVehicle && objVehicle.currentFormVehicle && objVehicle.currentFormVehicle && objVehicle.currentFormVehicle.Mileage ? objVehicle.currentFormVehicle.Mileage : null,//sin funcionamiento temporal
            surtidor: datosEstacion && datosEstacion.Dispenser ? datosEstacion.Dispenser : null,
            isla: datosEstacion && datosEstacion.Island ? datosEstacion.Island : null,
            manguera: datosEstacion && datosEstacion.Hose ? datosEstacion.Hose : null,
            nroCruce: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            prefijoCruce: InvoiceInformation.PosPrefix ? InvoiceInformation.PosPrefix : null,
            externalVehicleId: objVehicle && objVehicle.currentExternalVehicle && objVehicle.currentExternalVehicle && objVehicle.currentExternalVehicle.id ? objVehicle.currentExternalVehicle.id : null,
            idVehiculo: objVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle.id ? objVehicle.currentVehicle.id : null,
            fechaCobro: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            fecMov: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            idTarjetaBanco: currentPayment.id_tarjeta_banco ? currentPayment.id_tarjeta_banco : null,
            nroTransaccion: currentPayment.nro_transaccion ? currentPerson.nro_transaccion : null,            
            valorTotal: productData.valor_total ? productData.valor_total : 0.00,
            valorNeto: 0 ? 0 : 0.00, //no habian registros ni uso de esta funcion
            valorImpuesto: 0 ? 0 : 0.00, //no habian registros ni uso de esta funcion
            valorDescuento: productData.valor_descuento ? productData.valor_descuento : 0.00,
            valorAbono: 0,
            saldoActual: productData.valor_total ? productData.valor_total : 0.00,
            valorNetoSinImp: productData.valor_neto ? productData.valor_neto : 0.00,
            porcentajeDescuento: 0,
            valorDescuentoSinImp: productData.valor_impuesto > 0 ? 0 : productData.valor_descuento,
            valorDescuentoConImp: productData.valor_impuesto > 0 ? productData.valor_descuento : 0,
            totalImpuesto: productData.valor_impuesto ? productData.valor_impuesto : 0,
            valorCredito: currentPayment.currentPaymentForm.id === 3 ? (productData.valor_total ? productData.valor_total : null) : 0,
            idSucursal: idSucursal ? idSucursal : null,
            idUsuarioCre: idUsuario ? idUsuario : null,
            softwareExterno: true,
            idEmpresaOperadora: id_empresa_operadora.idPersona ? (id_empresa_operadora.idPersona) : null
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
        if (!datosCredito.outputInventoryTypeId) {
            throw new Error('Tipo de Identificador de la factura se generó incorrectamente.');
        }
        if (!regexNumeric.test(datosCredito.outputInventoryTypeId)) {
            throw new Error('El tipo de identificador no es valido.');
        }
        /* Type */
        if (!datosCredito.paymentFormInventoryId) {
            throw new Error('Forma de pago de la factura se generó incorrectamente.');
        }
        if (!datosCredito.paymentMethodInventoryId) {
            throw new Error('Metodo de pago de la factura se generó incorrectamente.');
        }
        if (!datosCredito.paymentMeanInventoryId) {
            throw new Error('Medio de pago de la factura se generó incorrectamente.');
        }
        if (!regexNumeric.test(datosCredito.paymentFormInventoryId)) {
            throw new Error('El tipo de identificador no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.inventoryOutputStateId) {
            throw new Error('Estado invalido de la factura.');
        }
        if (!regexNumeric.test(datosCredito.inventoryOutputStateId)) {
            throw new Error('El Precio no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.inventoryTypeBillingId) {
            throw new Error('El tipo de facturacion no es valido.');
        }
        if (!regexNumeric.test(datosCredito.inventoryTypeBillingId)) {
            throw new Error('El tipo de facturacion no es valido.');
        }
        /* Precio */ 
        if (!datosCredito.idPersona) {
            throw new Error('La persona no es valida.');
        }
        if (!regexNumeric.test(datosCredito.idPersona)) {
            throw new Error('La persona no es valida.');
        }
        /* Precio */ 
        if (!datosCredito.idEmpresaOperadora) {
            throw new Error('La persona no es valida.');
        }
        if (!regexNumeric.test(datosCredito.idEmpresaOperadora)) {
            throw new Error('La empresa operadora no es valida.');
        }
        /* Precio */ 
        if (!datosCredito.observacion) {
            throw new Error('Debe completar la observacion de la factura.');
        }
        /*Precio*/
        if (!datosCredito.fechaCobro) {
            throw new Error('Debe completar la fecha de la factura.');
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} outputData - Datos de la factura a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const createOutput = async (outputData, idUsuario, dbDate, transaction) => {
    try {
        outputData.idUsuarioCre = idUsuario;
        outputData.createdAt = dbDate;
        updatedPerson = await Output.create(outputData,{ transaction });
        return updatedPerson;
    } catch (error) {
        throw new Error('Error al gestionar la factura. ('+error+')');
    }
};
const createOutputDetail = async (outputDetailData, idUsuario, dbDate, transaction, outputId) => {
    try {
        outputDetailData.idUsuarioCre = idUsuario;
        outputDetailData.createdAt = dbDate;
        outputDetailData.outputInventoryId = outputId;
        console.log(outputDetailData);
        updatedPerson = await OutputInventoryDetail.create(outputDetailData,{ transaction });
        return updatedPerson;        
    } catch (error) {
        throw new Error('Error al gestionar la factura. ('+error+')');
    }
};
module.exports = { fillOutput, validateOutput, createOutput, createOutputDetail };
