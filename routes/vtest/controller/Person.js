const bcrypt = require('bcryptjs');
const { Persona } = require('../../../models'); // Importa tus modelos de Sequelize


/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} personData - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const managePerson = async (personData, idUsuario, dbDate, transaction) => {
    try {
        const currentPerson = await Persona.findOne({
            where: {
                nro_identificacion: personData.nro_identificacion
            }
        });

        let updatedPerson;

        if (currentPerson) {
            const idPersona = currentPerson.id;
            const [affectedRows] = await Persona.update(personData, {
                where: {
                    id_persona: idPersona
                }, transaction
            });

            if (affectedRows > 0) {
                updatedPerson = await Persona.findOne({
                    where: {
                        id_persona: idPersona
                    }, transaction
                });
            }
        } else {
            personData.id_usuario_cre = idUsuario;
            personData.fec_cre = dbDate;
            updatedPerson = await Persona.create(personData,{ transaction });
        }

        return updatedPerson;
    } catch (error) {
        throw new Error('Error al gestionar la persona. ('+error+')');
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} personData - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const fillPerson = async (datosTercero, idUsuario, dbDate) => {
    try {
        const personData = {
            id_tipo_persona: datosTercero.TypeId === 6 ? 1 : 2,
            id_tipo_doc_identificacion: datosTercero.TypeId ? datosTercero.TypeId : null,
            nro_identificacion: datosTercero.Id ? datosTercero.Id : null, // Limpiar datos
            nombre: datosTercero.Name ? datosTercero.Name.toUpperCase() : '',
            primer_apellido: datosTercero.FirstLastName ? datosTercero.FirstLastName.toUpperCase() : null,
            segundo_apellido: datosTercero.SecondLastName ? datosTercero.SecondLastName.toUpperCase() : null,
            dir: datosTercero.Adress ? datosTercero.Adress.toUpperCase() : null,
            celular: datosTercero.PhoneNumber ? datosTercero.PhoneNumber : null,
            tel_fijo: null,
            e_mail: datosTercero.Email ? datosTercero.Email.trim() : null,
            id_usuario_mod: idUsuario,
            fec_mod: dbDate
        };
        return personData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la persona.');
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} personData - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validatePerson = async (personData) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;        
        /* Name */
        if (!personData.nombre) {
            throw new Error('Debe completar el nombre de la persona.');                                                                                                                    
        }       
        if (!regexLetters.test(personData.nombre)) {
            throw new Error('El nombre solo debe contener letras.');                                                                                                                   
        }        
        /* Document Identification */        
        if (!personData.id_tipo_doc_identificacion) {       
            throw new Error('Debe completar el tipo de identificacion de la persona.');                                                                                                        
            
        }
        if (!regexNumeric.test(personData.id_tipo_doc_identificacion)) {
            throw new Error('El tipo de identificación no es valido.');                                                                                                        
            
        }       
        /* Identification */                
        if (!personData.nro_identificacion) {
            throw new Error('Debe completar la identificacion de la persona.');                                                                                                        
            
        }
        if (personData.id_tipo_doc_identificacion !== 7) {
            if (!regexNumeric.test(personData.nro_identificacion)) {
                throw new Error('El tipo de identificación no es valido.');                                                                                                        
            }
        }
        /* Last Names */        
        if ((personData.id_tipo_doc_identificacion === 6)) {
            if (personData.primer_apellido) {
                throw new Error('Las personas Juridicas unicamente solicitan nombre, no requieren apellidos.');                                                                                        
            } 
            if (personData.segundo_apellido) {
                throw new Error('Las personas Juridicas unicamente solicitan nombre, no requieren apellidos.');                                                                                        
            }            
        } 

        if(personData.primer_apellido !== null){
            if (!regexLetters.test(personData.primer_apellido)) {
                throw new Error('El primer apellido solo debe contener letras.');                                                                            
                
            }             
        }
        if(personData.segundo_apellido !== null){
            if (!regexLetters.test(personData.segundo_apellido)) {
                throw new Error('El segundo apellido solo debe contener letras.');                                                                            
            }             
        }         
        /* Email */                
        if (!personData.e_mail) {
            throw new Error('Debe completar el correo electrónico.');                                                            
        }
        if (!regexEmail.test(personData.e_mail)) {
            throw new Error('El correo no tiene un formato válido.');                                                
        }        
        /* Phone */                
        if (!personData.celular) {
            throw new Error('El celular del tercero es obligatorio.');                                    
        }
        if (!regexNumeric.test(personData.celular)) {
            throw new Error('El celular no tiene un formato valido.');                        
        }        
        if (!personData.celular.length === 10) {
            throw new Error('El celular debe de contener 10 dígitos (celular).');            
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillPerson, managePerson, validatePerson };
