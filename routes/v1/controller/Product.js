const bcrypt = require('bcryptjs');
const { Product } = require('../../../models'); // Importa tus modelos de Sequelize


/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const manageProduct = async (productData, idUsuario, dbDate, transaction) => {
    try {
        const currentProduct = await Product.findOne({
            where: {
                nro_identificacion: productData.nro_identificacion
            }
        });

        let updatedProduct;

        if (currentProduct) {
            const idProduct = currentProduct.id;
            const [affectedRows] = await Product.update(productData, {
                where: {
                    id_producta: idProduct
                }, transaction
            });

            if (affectedRows > 0) {
                updatedProduct = await Product.findOne({
                    where: {
                        id_producta: idProduct
                    }, transaction
                });
            }
        } else {
            productData.id_usuario_cre = idUsuario;
            productData.fec_cre = dbDate;
            updatedProduct = await Product.create(productData,{ transaction });
        }

        return updatedProduct;
    } catch (error) {
        throw new Error('Error al gestionar la producta. ('+error+')');
    }
};
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Product creado o actualizado.
 */
const fillProduct = async (datosProducto) => {
    try {
        const productData = {
            product_detail_id: datosProducto.IdProduct ? datosProducto.IdProduct : null,
            cantidad: datosProducto.TipoIdentificacion ? datosProducto.TipoIdentificacion : null,
            valor_unitario: datosProducto.Identificacion ? datosProducto.Identificacion : null, // Limpiar datos
            valor_total: datosProducto.Nombre ? datosProducto.Nombre.toUpperCase() : '',
            valor_neto: datosProducto.PrimerApellido ? datosProducto.PrimerApellido.toUpperCase() : null,
            valor_descuento: datosProducto.SegundoApellido ? datosProducto.SegundoApellido.toUpperCase() : null,
            valor_impuesto: datosProducto.Direccion ? datosProducto.Direccion.toUpperCase() : null,
            valor_venta: datosProducto.Celular ? datosProducto.Celular : null,
            iva_descontable: null,
            tarifa_iva: datosProducto.Correo ? datosProducto.Correo.trim() : null,
            valor_compra: datosProducto.IdProduct,
            valor_descuento_sin_imp: datosProducto.IdProduct,
            valor_descuento_con_imp: datosProducto.IdProduct,
            porcentaje_descuento: datosProducto.IdProduct,
            total_impuesto: datosProducto.IdProduct,
            porcentaje_utilidad_product: datosProducto.IdProduct,
            valor_compra_product: datosProducto.IdProduct,
            valor_venta_product: datosProducto.IdProduct,
            total_compra: datosProducto.IdProduct,
            total_utilidad: datosProducto.IdProduct,
            valor_utilidad_product: datosProducto.IdProduct,
            iva_rate_id: datosProducto.IdProduct
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la producto.'+error);
    }
};
/**
 * Función para gestionar una producta, crea o actualiza registros en la base de datos.
 * @param {Object} productData - Datos de la producta a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateProduct = async (productData) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;        
        /* Name */
        if (!productData.nombre) {
            throw new Error('Debe completar el nombre de la producta.');                                                                                                                    
        }       
        if (!regexLetters.test(productData.nombre)) {
            throw new Error('El nombre solo debe contener letras.');                                                                                                                   
        }        
        /* Document Identification */        
        if (!productData.id_tipo_doc_identificacion) {       
            throw new Error('Debe completar el tipo de identificacion de la producta.');                                                                                                        
            
        }
        if (!regexNumeric.test(productData.id_tipo_doc_identificacion)) {
            throw new Error('El tipo de identificación no es valido.');                                                                                                        
            
        }       
        /* Identification */                
        if (!productData.nro_identificacion) {
            throw new Error('Debe completar la identificacion de la producta.');                                                                                                        
            
        }
        if (productData.id_tipo_doc_identificacion !== 7) {
            if (!regexNumeric.test(productData.nro_identificacion)) {
                throw new Error('El tipo de identificación no es valido.');                                                                                                        
            }
        }
        /* Last Names */        
        if ((productData.id_tipo_doc_identificacion === 6 && productData.primer_apellido !== null && productData.segundo_apellido !== null)) {
            throw new Error('Las productas Juridicas unicamente solicitan nombre, no requieren apellidos.');                                                                                        
        } 
        if(productData.primer_apellido !== null){
            if (!regexLetters.test(productData.primer_apellido)) {
                throw new Error('El primer apellido solo debe contener letras.');                                                                            
                
            }             
        }
        if(productData.segundo_apellido !== null){
            if (!regexLetters.test(productData.segundo_apellido)) {
                throw new Error('El segundo apellido solo debe contener letras.');                                                                            
            }             
        }         
        /* Email */                
        if (!productData.e_mail) {
            throw new Error('Debe completar el correo electrónico.');                                                            
        }
        if (!regexEmail.test(productData.e_mail)) {
            throw new Error('El correo no tiene un formato válido.');                                                
        }        
        /* Phone */                
        if (!productData.celular) {
            throw new Error('El celular del tercero es obligatorio.');                                    
        }
        if (!regexNumeric.test(productData.celular)) {
            throw new Error('El celular no tiene un formato valido.');                        
        }        
        if (!productData.celular.length === 10) {
            throw new Error('El celular debe de contener 10 dígitos (celular).');            
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { fillProduct, manageProduct, validateProduct };
