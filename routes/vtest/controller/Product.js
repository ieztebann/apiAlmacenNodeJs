const bcrypt = require('bcryptjs');
const { Product, ProductDetails } = require('../../../models'); // Importa tus modelos de Sequelize

/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosProducto - Datos de la persona a crear o actualizar.
 * @param {number} idUsuario - ID del usuario que realiza la operación.
 * @param {string} dbDate - Fecha formateada actual en formato "YYYY-MM-DD HH:mm:ss".
 * @returns {Promise<Object>} - Retorna el objeto Persona creado o actualizado.
 */
const getProduct = async (idProduct) => {
    try {
        const currentProductDetail = await ProductDetails.findOne({
            where: {
                id: idProduct
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
const fillProduct = async (datosProducto) => {    
    let product;
    if(datosProducto.IdProduct ){
        product = await getProduct(datosProducto.IdProduct);            
    }           
    try {    
        const productData = {
            product_detail_id: datosProducto.IdProduct ? product.id : null,
            cantidad: datosProducto.Cantidad ? parseFloat(datosProducto.Cantidad) : null,
            valor_unitario: datosProducto.Precio ? parseFloat(datosProducto.Precio) : null, 
            valor_total: datosProducto.Total ? parseFloat(datosProducto.Total) : null,
            valor_neto: datosProducto.Subtotal ? parseFloat(datosProducto.Subtotal) : null,
            valor_descuento: datosProducto.Descuento ? parseFloat(datosProducto.Descuento) : 0.00,
            valor_impuesto: datosProducto.Iva ? parseFloat(datosProducto.Iva) : 0.00,
            valor_venta: datosProducto.Precio ? parseFloat(datosProducto.Precio) : null,
            iva_descontable: 0.00,                        
            valor_compra: datosProducto.Precio ? parseFloat(datosProducto.Precio) : null,
            valor_descuento_sin_imp: 0.00,
            valor_descuento_con_imp: 0,
            porcentaje_descuento: 0,
            total_impuesto: datosProducto.Iva ? parseFloat(datosProducto.Iva) : 0.00,
            valor_venta_product: datosProducto.Precio ? parseFloat(datosProducto.Precio) : null
            /*,//
            total_utilidad: datosProducto.IdProduct,//*
            valor_utilidad_product: datosProducto.IdProduct,//*
            total_compra: datosProducto.IdProduct,//*            
            valor_compra_product: datosProducto.IdProduct,//*            
            porcentaje_utilidad_product: datosProducto.IdProduct,//*            
            tarifa_iva: datosProducto.Correo ? datosProducto.Correo.trim() : null,//*        
            iva_rate_id: datosProducto.IdProduct//* */
        };
        return productData;
    } catch (error) {
        throw new Error('Error al llenar la informacion de la producto.'+error);
    }
};
/**
 * Función para gestionar una persona, crea o actualiza registros en la base de datos.
 * @param {Object} datosProducto - Datos de la persona a validar.
 * @returns {Promise<boolean>} - Retorna `true` si es valido, `false` de lo contrario.
 */
const validateProduct = async (datosProducto) => {
    try {
        /* Validation With Regex */
        const regexLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
        const regexNumeric = /^[0-9]+$/;
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;  
        const regexThreeDecimals = /^\d+(\.\d{3})?$/;
        
        /**/
        if (!datosProducto.product_detail_id) {
            throw new Error('Debe completar el identificador del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosProducto.product_detail_id)) {
            throw new Error('El identificador no es valido.');                                                                                                                    
        }         
        /**/
        if (!datosProducto.cantidad) {
            throw new Error('Debe completar la cantidad del producto.');                                                                                                                    
        }      
        if (!regexNumeric.test(datosProducto.cantidad)) {
            throw new Error('La cantidad no es valida.');                                                                                                                    
        }         
        /* Name */ 
        if (!regexLetters.test(datosProducto.nombre)) {
            throw new Error('El nombre solo debe contener letras.');                                                                                                                   
        }        
        /* Document Identification */        
        if (!datosProducto.id_tipo_doc_identificacion) {       
            throw new Error('Debe completar el tipo de identificacion de la persona.');                                                                                                        
            
        }      
        /* Identification */                
        if (!datosProducto.nro_identificacion) {
            throw new Error('Debe completar la identificacion de la persona.');                                                                                                        
            
        }
        if (datosProducto.id_tipo_doc_identificacion !== 7) {
            if (!regexNumeric.test(datosProducto.nro_identificacion)) {
                throw new Error('El tipo de identificación no es valido.');                                                                                                        
            }
        }
        /* Last Names */        
        if ((datosProducto.id_tipo_doc_identificacion === 6 && datosProducto.primer_apellido !== null && datosProducto.segundo_apellido !== null)) {
            throw new Error('Las personas Juridicas unicamente solicitan nombre, no requieren apellidos.');                                                                                        
        } 
        if(datosProducto.primer_apellido !== null){
            if (!regexLetters.test(datosProducto.primer_apellido)) {
                throw new Error('El primer apellido solo debe contener letras.');                                                                            
                
            }             
        }
        if(datosProducto.segundo_apellido !== null){
            if (!regexLetters.test(datosProducto.segundo_apellido)) {
                throw new Error('El segundo apellido solo debe contener letras.');                                                                            
            }             
        }         
        /* Email */                
        if (!datosProducto.e_mail) {
            throw new Error('Debe completar el correo electrónico.');                                                            
        }
        if (!regexEmail.test(datosProducto.e_mail)) {
            throw new Error('El correo no tiene un formato válido.');                                                
        }        
        /* Phone */                
        if (!datosProducto.celular) {
            throw new Error('El celular del tercero es obligatorio.');                                    
        }
        if (!regexNumeric.test(datosProducto.celular)) {
            throw new Error('El celular no tiene un formato valido.');                        
        }        
        if (!datosProducto.celular.length === 10) {
            throw new Error('El celular debe de contener 10 dígitos (celular).');            
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
};
module.exports = { fillProduct, validateProduct };
