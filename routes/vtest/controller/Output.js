const bcrypt = require('bcryptjs');
const { Product, ProductDetails, EmpresaSistema } = require('../../../models'); // Importa tus modelos de Sequelize
const { getEmpresaSistema } = require('./EmpresaSistema');
const { fillCredit } = require('./Credit');

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} currentPerson - Datos de la persona a crear o actualizar.
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
const fillOutput = async (currentPerson,productData,currentVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario, creditData) => {
    let product;
    let id_empresa_operadora = await getEmpresaSistema();
    if(currentPerson.ProductId ){
        product = await getProduct(currentPerson.ProductId);            
    }
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'    
    try {
        const OutputCredit = await fillCredit(currentPerson,productData,currentVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario, id_empresa_operadora);
        const OutputData = {
            id_forma_aplica_seguro: 1,//porcentaje
            tarifa_seguro: 0,
            id_persona: currentPerson.id ? (currentPerson.id) : null, 
            id_concepto_comprobante: currentVehicle && currentVehicle.id ? (1052) : 1156,
            InvoiceHolderInformationid_empresa_operadora: id_empresa_operadora.idPersona ? (id_empresa_operadora.idPersona) : null,
            fec_desembolso: InvoiceInformation.InvoiceDate ? `${InvoiceInformation.InvoiceDate} ${currentTime}` : null,
            fec_primera_cuota: InvoiceInformation.InvoiceDate ? (InvoiceInformation.InvoiceDate) : null,
            monto: currentPayment.currentPaymentForm.id === 3 ? productData.valor_total : 0,                        
            saldo_actual: currentPerson.Price ? (currentPerson.Price) : null,
            cant_cuotas: 1,
            tasa_interes: 0,
            tasa_interes_mora: 0,
            id_periodo_aplica_credito: 1,
            id_forma_pago_credito: 4,
            id_sucursal: currentPerson.Price ? (currentPerson.Price) : null,
            id_usuario_cre: currentPerson.Price ? (currentPerson.Price) : null,
            id_especifico: currentPerson.Price ? (currentPerson.Price) : null,
            output_inventory_id: currentPerson.Price ? (currentPerson.Price) : null,
            nro_especifico: currentPerson.Price ? (currentPerson.Price) : null,
            id_vehiculo: currentVehicle && currentVehicle.id ? (currentVehicle.id) : null,
            id_credito_generado: currentPerson.Price ? (currentPerson.Price) : null
        };
        return OutputData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la salida.'+error);
    }
};

module.exports = { fillOutput };
