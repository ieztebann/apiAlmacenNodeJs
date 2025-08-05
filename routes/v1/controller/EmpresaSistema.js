const bcrypt = require('bcryptjs');
const { EmpresaSistema, PrincipalModules } = require('../../../models'); // Importa tus modelos de Sequelize

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} personData - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const getEmpresaSistema = async () => {
    try {
        const currentPaymentForm = await EmpresaSistema.findOne({
            where: {
                principal: true,
                id_est_empresa_sistema: 1
            },
            attributes: ['idPersona'],
        });
        if(!currentPaymentForm){
            throw new Error('Empresa sistema no encontrada');            
        }
        return currentPaymentForm;
    } catch (error) {
        throw new Error('Error al encontrar informacion de pago. ('+error+')');
    }
};

const getUrlSilog = async () => {
    try {
        const currentSilogModule = await PrincipalModules.findOne({
            where: { id: 1 },
            attributes: ['url'],
        });

        if (!currentSilogModule || !currentSilogModule.url) {
            throw new Error('Url no encontrada');
        }

        const urlString = String(currentSilogModule.url).trim();
        console.log('URL original:', `[${urlString}]`);

        const baseUrl = urlString.replace(/\/inicio\/?$/i, ''); // i = ignora mayúsculas
        console.log('URL base:', baseUrl);

        return baseUrl;

    } catch (error) {
        throw new Error('Error al encontrar url silog. ('+error+')');
    }
};
module.exports = { getEmpresaSistema, getUrlSilog };
