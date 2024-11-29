const bcrypt = require('bcryptjs');
const { Persona } = require('../../../models'); // Importa tus modelos de Sequelize

/**
 * Función para validar la contraseña del usuario.
 * @param {string} passwordText - La contraseña proporcionada por el usuario.
 * @param {string} passwordHashed - La contraseña cifrada almacenada en la base de datos.
 * @returns {Promise<boolean>} - Retorna `true` si las contraseñas coinciden, `false` de lo contrario.
 */
const passwordValidate = async (passwordText, passwordHashed) => {
    try {
        const isValid = await bcrypt.compare(passwordText, passwordHashed);
        return isValid;
    } catch (error) {
        throw new Error('Error al comparar las contraseñas');
    }
};

module.exports = { passwordValidate };
