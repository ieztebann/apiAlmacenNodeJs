const bcrypt = require('bcryptjs');
const { Credit } = require('../../../models'); // Importa tus modelos de Sequelize
const { getEmpresaSistema } = require('./EmpresaSistema');

/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Credit creado o actualizado.
 */
const fillCredit = async (currentPerson,productData,currentVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'       
    const id_empresa_operadora = await getEmpresaSistema();    
    try {    
        const CreditData = {
            id_forma_aplica_seguro: 1,//porcentaje
            tarifa_seguro: 0,
            id_persona: currentPerson.id ? (currentPerson.id) : null, 
            id_concepto_comprobante: currentVehicle && currentVehicle.id ? (1052) : 1156,
            id_empresa_operadora: id_empresa_operadora.idPersona ? (id_empresa_operadora.idPersona) : null,
            fec_desembolso: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            fec_primera_cuota: InvoiceInformation.InvoiceDate ? (InvoiceInformation.InvoiceDate) : null,
            monto: currentPayment.currentPaymentForm.id === 3 ? productData.valor_total : 0,                        
            saldo_actual: currentPayment.currentPaymentForm.id === 3 ? productData.valor_total : 0,
            cant_cuotas: 1,
            tasa_interes: 0,
            tasa_interes_mora: 0,
            id_periodo_aplica_credito: 1,
            id_forma_pago_credito: 4,
            id_sucursal: idSucursal ? idSucursal : null,
            id_usuario_cre: idUsuario ? idUsuario : null,
            id_especifico: outputId ? outputId : null,
            output_inventory_id: outputId ? outputId : null,
            nro_especifico: InvoiceInformation.PosConsecutive ? InvoiceInformation.PosConsecutive : null,
            id_vehiculo: currentVehicle && currentVehicle.id ? currentVehicle && currentVehicle.id : null
        };
        return CreditData;
    } catch (error) {
        throw new Error('Error al llenar la informacion del credito.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosCredito - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateCredit = async (datosCredito) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{1,3})?$/;
            
        /* CreditId */
        if (!datosCredito.product_detail_id) {
            throw new Error('Debe completar el identificador del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosCredito.product_detail_id)) {
            throw new Error('El identificador no es valido.');                                                                                                                    
        }         
        /* Cantidad */
        if (!datosCredito.cantidad) {
            throw new Error('Debe completar la cantidad del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosCredito.cantidad)) {
            throw new Error('La cantidad no es valida.');                                                                                                                    
        }         
        /* Precio */ 
        if (!datosCredito.valor_unitario) {
            throw new Error('Debe completar el Precio del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosCredito.valor_unitario)) {
            throw new Error('El Precio no es valido.');                                                                                                                    
        }         
        /* Descuento */ 
        if (!regexThreeDecimals.test(datosCredito.valor_descuento)) {
            throw new Error('El Descuento no es valido.');                                                                                                                    
        }         
        /* Iva */  
        if (!regexThreeDecimals.test(datosCredito.valor_impuesto)) {
            throw new Error('El Iva no es valido.');                                                                                                                    
        }             
        /* Subtotal */ 
        if (!datosCredito.valor_neto) {
            throw new Error('Debe completar el Subtotal del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosCredito.valor_neto)) {
            throw new Error('El Subtotal no es valido.');                                                                                                                    
        }                    
        /* Total */ 
        if (!datosCredito.valor_total) {
            throw new Error('Debe completar el Total del producto.');                                                                                                                    
        }      
        if (!regexThreeDecimals.test(datosCredito.valor_total)) {
            throw new Error('El Total no es valido.');                                                                                                                    
        }           
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillCredit, validateCredit };
