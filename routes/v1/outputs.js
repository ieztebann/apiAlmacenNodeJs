const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Usuario, Persona, Sucursal, Output } = require('../../models'); // Importa tus modelos de Sequelize
const { PersonController, UtilController, ProductController, OutputController, VehicleController, PaymentController, CreditController } = require('./controller');  // Importa la función de validación
const app = express();
const sequelize = require('../../config/database');


app.use(express.json()); // este middleware para manejar JSON

router.post('/output', [
    body().notEmpty().withMessage('Campos obligatorios sin enviar'),
    body('UserInformation.UserIdent').notEmpty().withMessage('Debe enviar la identificación del usuario'),
    body('UserInformation.UserPassword').notEmpty().withMessage('Debe enviar la contraseña'),
    body('InvoiceInformation.PosPrefix').notEmpty().withMessage('Debe enviar el prefijo de la factura'),

], async (req, res) => {
    let datosEntrada;
    datosEntrada = req.body;   
    // Iniciar una transacción
    const transaction = await sequelize.transaction();
    try {

        const { InvoiceInformation, UserInformation, StationInformation } = datosEntrada;            
        const { InvoiceInformation: { ProductInformation: datosProducto, VehicleInformation: datosVehiculo, PaymentInformation : datosPago, InvoiceHolderInformation: datosTercero } } = datosEntrada;

        // Verificar si el usuario existe
        let idUsuario = 0;

        if (!UserInformation) {
            return await safeResponse(res, transaction, 400, { error: 'Campos del usuario Obligatorios' });
        }
        if (!UserInformation.UserIdent) {
            return await safeResponse(res, transaction, 401, { error: 'Identificación del usuario Incompleta' });
        }
        if (!UserInformation.UserPassword) {
            return await safeResponse(res, transaction, 401, { error: 'Contraseña del usuario Incompleta' });
        }
        console.log(`[${new Date().toISOString()}] Intento de facturación por usuario ${UserInformation.UserIdent}`);

        const usuarioActivo = await Usuario.findOne({
            where: {
                activo: true,
                nro_cedula: UserInformation.UserIdent
            }
        });

        if (!usuarioActivo) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales invalidas' });
        }  
        
        const isValidPasswd = await UtilController.passwordValidate(UserInformation.UserPassword, usuarioActivo.password);
        if (!isValidPasswd) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales invalidas' });
        }
        
        idUsuario = usuarioActivo.id;
        
        if (!InvoiceInformation) {
            return await safeResponse(res, transaction, 400, { error: 'Campos de la Factura obligatorios' });
        }
        if (!datosTercero) {
            return await safeResponse(res, transaction, 400, { error: 'Campos del Tercero obligatorios' });
        }
        if (!datosProducto) {
            return res.status(400).json({ error: 'Campos del Producto obligatorios' });
        }
        if (!datosPago) {
            return res.status(400).json({ error: 'Campos del Pago obligatorios' });
        }
        
        const fecNow = new Date();
        // Obtener los componentes de la fecha
        const year = fecNow.getFullYear();
        const month = String(fecNow.getMonth() + 1).padStart(2, '0');  // Mes (debe sumarse 1)
        const day = String(fecNow.getDate()).padStart(2, '0');  // Día
        const hours = String(fecNow.getHours()).padStart(2, '0');  // Hora
        const minutes = String(fecNow.getMinutes()).padStart(2, '0');  // Minutos
        const seconds = String(fecNow.getSeconds()).padStart(2, '0');  // Segundos
        const dbDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;        

        if (!UserInformation.SucursalId) {
            return res.status(400).json({ error: 'Debe enviar la sucursal' });
        }
        
        const sucursal = await Sucursal.findOne({
            where: {
                id_est_registro: 1,
                id_tipo_sucursal: 7,
                id_sucursal: UserInformation.SucursalId,
            }
        });

        if (!sucursal) {
            return res.status(404).json({ error: `Sucursal invalida, consulte los listados` });
        }        
        
        const idSucursal = sucursal.id;
        let idPersona = 0;


        // ## Fill Person Object Initiation 
        const personData = await PersonController.fillPerson(datosTercero,idUsuario,dbDate);                
        const validatePerson = await PersonController.validatePerson(personData);        
        const currentPerson = await PersonController.managePerson(personData,idUsuario,dbDate,transaction);
        idPersona = currentPerson.id;       
                  
        // ## Vehicle   
        let vehicleData;
        let validateVehicle;
        let currentVehicle;
        
        if(datosVehiculo){
            vehicleData = await VehicleController.fillVehicle(datosVehiculo); 
            validateVehicle = await VehicleController.validateVehicle(vehicleData);      
            objVehicle = await VehicleController.manageVehicle(vehicleData, idPersona, idUsuario, transaction);         
        }
        //Payment
        const paymentData = await PaymentController.fillPayment(datosPago); 
        const validatePayment = await PaymentController.validatePayment(paymentData); 
        const currentPayment = await PaymentController.getPayment(paymentData);         
        
        // Reservar ID para la tabla principal
        const [inventoryOutputsIdSeq] = await sequelize.query(
            "SELECT nextval('almacen.inventory_outputs_id_seq') AS id", // Cambia por el nombre correcto de tu secuencia
            { transaction }
        );
        const outputId = await inventoryOutputsIdSeq[0].id;  



        let generalProductData = {}; 
        let arrOutputDetails = []; 
        if (Array.isArray(datosProducto) && datosProducto.length > 0) {
            generalProductData.valor_total = 0;
            generalProductData.valor_neto = 0;
            generalProductData.valor_descuento = 0;
            generalProductData.valor_impuesto = 0;

            for (const producto of datosProducto) {
                try {
                    const productData = await ProductController.fillProduct(producto,idSucursal);
                    const validateProduct = await ProductController.validateProduct(productData);
                    arrOutputDetails.push(productData);
                    generalProductData.valor_total += productData.valorTotal;
                    generalProductData.valor_neto += productData.valorNeto;
                    generalProductData.valor_descuento += productData.valorDescuento;
                    generalProductData.valor_impuesto += productData.valorImpuesto;
                } catch (error) {
                    return await safeResponse(res, transaction, 400, {
                        error: `Error al procesar el producto: ${error.message}`,
                    });                    
                }
            }
        } else {
            return await safeResponse(res, transaction, 400, { error: 'Debe enviar al menos un producto en la factura.' });
        }           
        // SalidaDeInventario
        const outputData = await OutputController.fillOutput(currentPerson,generalProductData,objVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario,StationInformation); 
        const validateOutput = await OutputController.validateOutput(outputData); 
        const currentOutput = await OutputController.createOutput(outputData, idUsuario, dbDate , transaction); 

        //Detalles de inventario
        let currentOutputDetail;
        for (const outputDetails of arrOutputDetails) {
            try {
                currentOutputDetail = await OutputController.createOutputDetail(outputDetails, idUsuario, dbDate , transaction, outputId);
            } catch (error) {
                return await safeResponse(res, transaction, 400, {
                    error: `Error al procesar el producto: ${error}`,
                });                    
            }
        }
        // Credit
        let creditData;
        let currentCredit;
        if(currentPayment.currentPaymentForm.id === 3){
            creditData = await CreditController.fillCredit(currentPerson,generalProductData,objVehicle,InvoiceInformation, currentPayment, outputId, idSucursal, idUsuario);             
            const validateCredit = await CreditController.validateCredit(creditData); 
            currentCredit = await CreditController.createCredit(creditData, idUsuario, dbDate , transaction); 
        }
        await transaction.commit();
        return res.status(200).json({ ok: 'Factura generada exitosamente.', message : {currentOutput:currentOutput, currentCredit:currentCredit} });

        // const creditData = await CreditController.Credit(datosProducto); 

    } catch (error) {
        if(error.message){
            return await safeResponse(res, transaction, 500, { error: 'Se ha presentado un problema.', message : error.message });
        }
        return await safeResponse(res, transaction, 500, { error: 'Formato de datos no válido.', message : error });
    }
});


router.delete('/output', [
    body().notEmpty().withMessage('Campos obligatorios sin enviar'),
    body('UserInformation.UserIdent').notEmpty().withMessage('Debe enviar la identificación del usuario'),
    body('UserInformation.UserPassword').notEmpty().withMessage('Debe enviar la contraseña'),
    body('InvoiceInformation.Id').notEmpty().withMessage('Debe enviar el identificador de la factura'),
    body('InvoiceInformation.CancellationDescription').notEmpty().withMessage('Debe enviar la descripción de anulación')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { UserInformation, InvoiceInformation } = req.body;
    const transaction = await sequelize.transaction();

    try {
        console.log(`[${new Date().toISOString()}] Intento de anulación de factura por usuario ${UserInformation.UserIdent}`);

        // Verificación del usuario
        const usuarioActivo = await Usuario.findOne({
            where: { activo: true, nro_cedula: UserInformation.UserIdent }
        });

        if (!usuarioActivo) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales inválidas' });
        }

        const isValidPasswd = await UtilController.passwordValidate(UserInformation.UserPassword, usuarioActivo.password);
        if (!isValidPasswd) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales inválidas' });
        }

        const idUsuario = usuarioActivo.id;

        // Verificar factura
        const invoice = await Output.findOne({
            where: { id: InvoiceInformation.Id, id_usuario_cre: idUsuario }
        });

        if (!invoice) {
            return await safeResponse(res, transaction, 404, { error: 'Factura no encontrada, o usuario de generacion diferente' });
        }

        if (invoice.inventoryOutputStateId === 4) {
            return await safeResponse(res, transaction, 400, { error: 'La factura ya está anulada.' });
        }

        // Preparar fecha actual en formato correcto
        const dbDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const idFactura = invoice.id;

        // Intentar actualizar
        const [affectedRows] = await Output.update(
            { inventoryOutputStateId: 4, updatedAt: dbDate, idUsuarioMod: idUsuario, razonModificacion: InvoiceInformation.CancellationDescription },
            {
                where: {
                    id: idFactura,
                    idUsuarioCre: idUsuario,
                },
                transaction
            }
        );

        if (affectedRows === 0) {
            return await safeResponse(res, transaction, 400, {
                error: 'No se puede anular la factura. Comunicate con soporte en caso de que en el sistema no se encuentre anulada.'
            });
        }

        const updatedOutput = await Output.findOne({
            where: { id: idFactura },
            transaction
        });

        await transaction.commit();
        return res.status(200).json({ ok: 'Factura Anulada con Exito', updatedOutput: updatedOutput });

    } catch (error) {
        await transaction.rollback();
        return await safeResponse(res, transaction, 500, {
            error: 'Se ha presentado un problema.',
            message: error
        });
    }
});

router.post('/output/:id', [
    body('UserInformation.UserIdent').notEmpty().withMessage('Debe enviar la identificación del usuario'),
    body('UserInformation.UserPassword').notEmpty().withMessage('Debe enviar la contraseña')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const invoiceId = req.params.id;
    const { UserInformation } = req.body;
    const transaction = await sequelize.transaction();

    try {
        console.log(`[${new Date().toISOString()}] Consulta de factura por usuario ${UserInformation.UserIdent}`);

        // Verificación del usuario
        const usuarioActivo = await Usuario.findOne({
            where: { activo: true, nro_cedula: UserInformation.UserIdent }
        });

        if (!usuarioActivo) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales inválidas' });
        }

        const isValidPasswd = await UtilController.passwordValidate(UserInformation.UserPassword, usuarioActivo.password);
        if (!isValidPasswd) {
            return await safeResponse(res, transaction, 401, { error: 'Credenciales inválidas' });
        }

        const idUsuario = usuarioActivo.id;

        // Buscar la factura
        const invoice = await Output.findOne({
            where: {
                id: invoiceId,
                idUsuarioCre: idUsuario
            }
        });

        if (!invoice) {
            return await safeResponse(res, transaction, 404, { error: 'Factura no encontrada o acceso denegado' });
        }

        await transaction.commit();
        return res.status(200).json({ ok: true, invoice });

    } catch (error) {
        await transaction.rollback();
        return await safeResponse(res, transaction, 500, {
            error: 'Se ha presentado un problema.',
            message: error
        });
    }
});


const safeResponse = async (res, transaction, status, message) => {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    return res.status(status).json(message);
  };
  
module.exports = router;