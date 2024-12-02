const bcrypt = require('bcryptjs');
const { Product, ProductDetails } = require('../../../models'); // Importa tus modelos de Sequelize

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
const fillOutput = async (currentPerson, productData) => {
    let product;
    if(currentPerson.ProductId ){
        product = await getProduct(currentPerson.ProductId);            
    }
    
    try {    
        const productData = {
            id_forma_aplica_seguro: 1,//porcentaje
            tarifa_seguro: 0,
            id_persona: currentPerson.id ? (currentPerson.id) : null, 
            id_concepto_comprobante: () : null,
            id_empresa_operadora: currentPerson.Discunt ? (currentPerson.Discunt) : 0.00,
            fec_desembolso: currentPerson.Iva ? (currentPerson.Iva) : 0.00,
            fec_primera_cuota: currentPerson.Price ? (currentPerson.Price) : null,
            monto: 0.00,                        
            saldo_actual: currentPerson.Price ? (currentPerson.Price) : null,
            cant_cuotas: 0.00,
            tasa_interes: 0,
            tasa_interes_mora: 0,
            id_periodo_aplica_credito: currentPerson.Iva ? (currentPerson.Iva) : 0.00,
            id_forma_pago_credito: currentPerson.Price ? (currentPerson.Price) : null,
            id_sucursal: currentPerson.Price ? (currentPerson.Price) : null,
            id_usuario_cre: currentPerson.Price ? (currentPerson.Price) : null,
            id_especifico: currentPerson.Price ? (currentPerson.Price) : null,
            output_inventory_id: currentPerson.Price ? (currentPerson.Price) : null,
            nro_especifico: currentPerson.Price ? (currentPerson.Price) : null,
            id_vehiculo: currentPerson.Price ? (currentPerson.Price) : null,
            id_credito_generado: currentPerson.Price ? (currentPerson.Price) : null
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la producto.'+error);
    }
};

module.exports = { fillOutput };
