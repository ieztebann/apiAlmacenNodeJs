const bcrypt = require('bcryptjs');
const { Credito } = require('../../../models'); // Importa tus modelos de Sequelize
const { getEmpresaSistema } = require('./EmpresaSistema');

/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Credit creado o actualizado.
 */
const fillCredit = async (currentPerson,productData,objVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'       
    const id_empresa_operadora = await getEmpresaSistema();
    try {    
        const CreditData = {
            idFormaAplicaSeguro: 1,//porcentaje
            tarifaSeguro: 0,
            idPersona: currentPerson.id ? (currentPerson.id) : null, 
            idConceptoComprobante: objVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle.id ? (process.env.ID_CPTO_CREDITO_ALMACEN_VEHICULO || 1052) : (process.env.ID_CPTO_CREDITO_ALMACEN_TERCERO || 1156),//2415,2416
            idEmpresaOperadora: id_empresa_operadora.idPersona ? (id_empresa_operadora.idPersona) : null,
            fecDesembolso: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} 00:00:00` : null,
            fecPrimeraCuota: InvoiceInformation.InvoiceDate ? (InvoiceInformation.InvoiceDate) : null,
            monto: currentPayment.currentPaymentForm.id === 3 ? productData.valor_total : 0,                        
            saldoActual: currentPayment.currentPaymentForm.id === 3 ? productData.valor_total : 0,
            cantCuotas: 1,
            tasaInteres: 0,
            tasaInteresMora: 0,
            idPeriodoAplicaCredito: 1,
            idFormaPagoCredito: 4,
            idSucursal: idSucursal ? idSucursal : null,
            idUsuarioCre: idUsuario ? idUsuario : null,
            idEspecifico: outputId ? outputId : null,
            outputInventoryId: outputId ? outputId : null,
            nroEspecifico: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            idVehiculo: objVehicle && objVehicle.currentVehicle && objVehicle.currentVehicle.id ? objVehicle.currentVehicle.id : null
        };
        console.log(CreditData);
        return CreditData;
    } catch (error) {
        throw new Error('Error al llenar la informacion del credito.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} outputData - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateCredit = async (creditData) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{1,3})?$/;
            
        /* id_forma_aplica_seguro */
        if (!creditData.idFormaAplicaSeguro) {
            throw new Error('Forma de aplica credito.');                                                                                                                    
        }     
        /* fec_desembolso */
        if (!creditData.fecDesembolso) {
            throw new Error('fecHA Desembolso credito.');                                                                                                                    
        }     
        /* fec_primera_cuota */
        if (!creditData.fecPrimeraCuota) {
            throw new Error('fecPrimeraCuota credito.');                                                                                                                    
        }       
        /* Cantidad */
        if (!creditData.idPersona) {
            throw new Error('Debe completar la persona del credito.');                                                                                                                    
        }      
        if (!regexNumeric.test(creditData.idPersona)) {
            throw new Error('La persona no es valida.');                                                                                                                    
        }               
        /* saldo_actual */ 
        if (!creditData.saldoActual) {
            throw new Error('Debe completar el saldo_actual del producto.');                                                                                                                    
        }                 
        /* monto */ 
        if (!creditData.monto) {
            throw new Error('Debe completar el monto del producto.');                                                                                                                    
        }     
        return true;
    } catch (error) {
        throw new Error(error);
    }
};
const createCredit = async (creditData, idUsuario, dbDate, transaction) => {
    try {
        creditData.idUsuarioCre = idUsuario;
        creditData.createdAt = dbDate;
        createdCredit = await Credito.create(creditData,{ transaction });
        return createdCredit;
    } catch (error) {
        throw new Error('Error al gestionar la factura. ('+error+')');
    }
};
module.exports = { fillCredit, validateCredit, createCredit };
