const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Usuario, Persona, Sucursal } = require('../../models'); // Importa tus modelos de Sequelize
const { PersonController, UtilController, ProductController, OutputController, VehicleController, PaymentController, CreditController } = require('./controller');  // Importa la función de validación
const app = express();
const sequelize = require('../../config/database');


app.use(express.json()); // Asegúrate de tener este middleware para manejar JSON
/**
 * @swagger
 * /output:
 *   post:
 *     summary: Crear Factura de Venta
 *     description: |
 *       Este endpoint permite realizar la creacion de facturas (Salidas de Inventario) de el Almacen.      
 *     tags:
 *       - Almacen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "Informacion Estructurada de La Factura"           
 *             required:
 *               - UserInformation
 *               - StationInformation          
 *               - InvoiceInformation          
 *             properties:
 *               UserInformation:
 *                 type: object
 *                 description: "Informacion del Usuario que genera la factura"
 *                 required:
 *                   - SucursalId
 *                   - UserIdent          
 *                   - UserPassword
 *                 properties:
 *                   SucursalId:
 *                     type: integer
 *                     description: "Identificador de la sucursal donde genera la factura"
 *                     example: 1
 *                   UserIdent:
 *                     type: string
 *                     description: "Identificacion del usuario que genera la factura"
 *                     example: "1234567890"
 *                   UserPassword:
 *                     type: string
 *                     description: "Contraseña del usuario que genera la factura"
 *                     example: "pepitoperez123"
 *               StationInformation:
 *                 type: object
 *                 description: "Informacion de la Estacion de Servicios"                
 *                 properties:
 *                   Dispenser:
 *                     type: string
 *                     description: "Referencia con la que identifican el dispensador"                     
 *                     example: "1"
 *                     nullable: true
 *                   Island:
 *                     type: string
 *                     description: "Referencia con la que identifican la Isla del dispensador"                     
 *                     example: "1"
 *                     nullable: true
 *                   Hose:
 *                     type: string
 *                     description: "Referencia con la que identifican la manguera del dispensador"                     
 *                     example: "1"
 *                     nullable: true
*               InvoiceInformation:
*                 type: object
*                 description: "Informacion de la factura"    
*                 required:
*                   - PosPrefix
*                   - PosConsecutive          
*                   - InvoiceDate              
*                   - VehicleInformation              
*                   - InvoiceHolderInformation              
*                   - ProductInformation              
*                   - PaymentInformation              
*                 properties:                  
*                   PosConsecutive:
*                     type: integer
*                     example: 1234
*                   InvoiceDate:
*                     type: string
*                     example: "2024-12-24"
*                   Details:
*                     type: string
*                     example: "Placa: LWY535, Kilometraje : 0.00, Nro Transaccion : 123"
*                   VehicleInformation:
*                     type: object
*                     properties:
*                       Plate:
*                         type: string
*                         example: "LWY535"
*                       LastMaintenanceDate:
*                         type: string
*                         example: "2024-07-11"
*                       NextMaintenanceDate:
*                         type: string
*                         example: "2025-07-11"  
*                       Mileage:
*                         type: string
*                         example: "125.40" 
*                   InvoiceHolderInformation:
*                     type: object
*                     description: "Informacion de la factura"    
*                     required:
*                          - TypeId
*                          - Id          
*                          - Name              
*                          - FirstLastName              
*                          - SecondLastName              
*                          - Adress              
*                          - Email   
*                     properties:
*                       TypeId:
*                         type: integer
*                         example: 6
*                       Id:
*                         type: string
*                         example: "890200218"
*                       Name:
*                         type: string
*                         example: "Cotaxi"  
*                       FirstLastName:
*                         type: string
*                         example: ""  
*                       SecondLastName:
*                         type: string
*                         example: ""  
*                       Adress:
*                         type: string
*                         example: "CRA 19 16-58 Bucaramanga"   
*                       Email:
*                         type: string
*                         example: "clientesyproovedorescotaxi@gmail.com"   
*                       PhoneNumber:
*                         type: string
*                         example: "3021234567"   
*                       LandlinePhoneNumber:
*                         type: string
*                         example: "6010923"
*                   ProductInformation:
*                     type: array
*                     required:
*                          - ProductId
*                          - Quantity
*                          - Discunt
*                          - Price
*                          - TotalPrice
*                          - SkipAuditWarehouseValues
*                     items:
*                       type: object
*                       properties:
*                         ProductId:
*                           type: integer
*                           example: 4
*                         Quantity:
*                           type: number
*                           format: float
*                           example: 100.0001
*                         Discunt:
*                           type: number
*                           format: float
*                           example: 100.0001
*                         Price:
*                           type: number
*                           format: float
*                           example: 100.0001
*                         TotalPrice:
*                           type: number
*                           format: float
*                           example: 100.0001
*                         SkipAuditWarehouseValues:
*                           type: boolean
*                           example: false
*                           description: "si es true: omite las validaciones del almacen como el precio de venta y demas validaciones de auditoria y recibe tal cual lo que envia el api, si es false: genera auditoria del sistema"    
*                   PaymentInformation:
*                     type: object
*                     properties:
*                       PaymentFormId:
*                         type: integer
*                         example: 1  
*                       PaymentMethodId:
*                         type: integer
*                         example: 1   
*                       PaymentMeandId:
*                         type: integer
*                         example: 1
*                       CardId:
*                         type: integer
*                         example: 1  
*                       TransaccionNumber:
*                         type: number
*                         example: 100
 *     responses:
 *       200:
 *         description: Factura generada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: string
 *                   example: "Factura generada exitosamente."
 *                 message:
 *                   type: object
 *                   properties:
 *                     currentOutput:
 *                       type: object
 *                       example:
 *                         id: 1382220
 *                         outputInventoryTypeId: 1
 *                         paymentFormInventoryId: 3
 *                         paymentMethodInventoryId: 3
 *                         paymentMeanInventoryId: 3
 *                         inventoryOutputStateId: 2
 *                         inventoryTypeBillingId: 3
 *                         idPersona: 1128508543
 *                         observacion: "Placa: BOP461, Kilometraje : 0.00, Nro Transaccion : 123"
 *                         dispenserNumber: "1234"
 *                         kilometrosVeh: null
 *                         surtidor: "hola"
 *                         isla: "1"
 *                         manguera: "1"
 *                         nroCruce: "1234"
 *                         prefijoCruce: null
 *                         externalVehicleId: 81076
 *                         idVehiculo: null
 *                         fechaCobro: "2025-04-22T19:49:00.000Z"
 *                         fecMov: "2025-04-22T19:49:00.000Z"
 *                         idTarjetaBanco: null
 *                         nroTransaccion: null
 *                         valorTotal: "33483.5"
 *                         valorNeto: "0"
 *                         valorImpuesto: "0"
 *                         valorDescuento: "0"
 *                         valorAbono: "0"
 *                         saldoActual: "33483.5"
 *                         valorNetoSinImp: "33483.5"
 *                         porcentajeDescuento: "0"
 *                         valorDescuentoSinImp: "0.00"
 *                         valorDescuentoConImp: "0.00"
 *                         totalImpuesto: "0.00"
 *                         valorCredito: "33483.5"
 *                         idSucursal: 968
 *                         idUsuarioCre: 395
 *                         softwareExterno: true
 *                         idEmpresaOperadora: 2
 *                         createdAt: "2025-04-24T19:49:00.000Z"
 *                         prefijo: "EDSI"
 *                         numero: "277606"
 *                         prefijoResolucion: "EDSI"
 *                         numeroResolucion: "277606"
 *                         resolucion: null
 *                         idUsuarioMod: null
 *                         updatedAt: null
 *                         razonModificacion: null
 *                     currentCredit:
 *                       type: object
 *                       example:
 *                         idEstCreditoGenerado: 1
 *                         fecCre: "2025-04-24T19:49:00.000Z"
 *                         id: 143122
 *                         idFormaAplicaSeguro: 1
 *                         tarifaSeguro: "0.000"
 *                         idPersona: 1128508543
 *                         idConceptoComprobante: 1156
 *                         idEmpresaOperadora: 2
 *                         fecDesembolso: "2025-04-22T10:00:00.000Z"
 *                         fecPrimeraCuota: "2025-04-22"
 *                         monto: "33483.50"
 *                         saldoActual: "33483.50"
 *                         cantCuotas: "1"
 *                         tasaInteres: "0.00"
 *                         tasaInteresMora: "0"
 *                         idPeriodoAplicaCredito: 1
 *                         idFormaPagoCredito: 4
 *                         idSucursal: 968
 *                         idUsuarioCre: 395
 *                         idEspecifico: 1382220
 *                         outputInventoryId: 1382220
 *                         nroEspecifico: "1234"
 *                         idVehiculo: null
 *                         diasMora: "0"
 *                         arrCodeudores: null
 *                         idUsuarioMod: null
 *                         fecMod: null
 *                         observacion: null
 *                         nroPagare: null
 *                         requierePagare: false
 *                         razonModificacion: null
 *       404:
 *         description: No se encontro informacion
 *       500:
 *         description: Error en la generacion de la factura
 *   delete:
 *     summary: Anula Factura de Venta
 *     description: |
 *       Este endpoint permite realizar la anulacion de facturas (Salidas de Inventario) de el Almacen.      
 *     tags:
 *       - Almacen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "Informacion Estructurada de La Factura"           
 *             required:
 *               - UserInformation
 *               - InvoiceInformation          
 *             properties:
 *               UserInformation:
 *                 type: object
 *                 description: "Informacion del Usuario que genera la factura"
 *                 required:
 *                   - SucursalId
 *                   - UserIdent          
 *                   - UserPassword
 *                 properties:
 *                   SucursalId:
 *                     type: integer
 *                     description: "Identificador de la sucursal donde genera la factura"
 *                     example: 1
 *                   UserIdent:
 *                     type: string
 *                     description: "Identificacion del usuario que genera la factura"
 *                     example: "1234567890"
 *                   UserPassword:
 *                     type: string
 *                     description: "Contraseña del usuario que genera la factura"
 *                     example: "pepitoperez123"
 *               InvoiceInformation:
 *                 type: object
 *                 description: "Informacion de la Estacion de Servicios"                
 *                 properties:
 *                   Id:
 *                     type: integer
 *                     description: "Referencia con la que identifican la factura"                     
 *                     example: 1
 *                     nullable: false
 *                   CancellationDescription:
 *                     type: string
 *                     description: "Detalle con la que anulan la factura"                     
 *                     example: "prueba"
 *                     nullable: false
 *     responses:
 *       200:
 *         description: Factura Anulada con Éxito
 *         content:
 *           application/json:
 *             example:
 *               ok: "Factura Anulada con Exito"
 *               updatedOutput:
 *                 id: 1382270
 *                 outputInventoryTypeId: 1
 *                 paymentFormInventoryId: 3
 *                 paymentMethodInventoryId: 3
 *                 paymentMeanInventoryId: 3
 *                 inventoryTypeBillingId: 3
 *                 inventoryOutputStateId: 4
 *                 idSucursal: 968
 *                 prefijo: "EDSI"
 *                 numero: "277624"
 *                 prefijoResolucion: "EDSI"
 *                 numeroResolucion: "277624"
 *                 idPersona: 1128508543
 *                 idVehiculo: null
 *                 fecMov: "2025-04-22T20:10:11.000Z"
 *                 fechaCobro: "2025-04-22T20:10:11.000Z"
 *                 valorTotal: "33483.5"
 *                 valorAbono: "0"
 *                 valorDescuento: "0"
 *                 totalImpuesto: "0.00"
 *                 valorNeto: "0"
 *                 valorImpuesto: "0"
 *                 valorDescuentoSinImp: "0.00"
 *                 valorDescuentoConImp: "0.00"
 *                 saldoActual: "33483.5"
 *                 observacion: "Placa: BOP461, Kilometraje : 0.00, Nro Transaccion : 123"
 *                 resolucion: null
 *                 idUsuarioCre: 395
 *                 idUsuarioMod: 395
 *                 createdAt: "2025-04-24T20:10:11.000Z"
 *                 updatedAt: "2025-04-25T01:10:27.000Z"
 *                 razonModificacion: "Prueba"
 *                 idEmpresaOperadora: 2
 *                 valorNetoSinImp: "33483.5"
 *                 porcentajeDescuento: "0"
 *                 idTarjetaBanco: null
 *                 nroTransaccion: null
 *                 softwareExterno: true
 *                 externalVehicleId: 81076
 *                 dispenserNumber: "1234"
 *                 surtidor: "1"
 *                 isla: "1"
 *                 manguera: "1"
 *                 nroCruce: "1234"
 *                 prefijoCruce: null
 *                 kilometrosVeh: null
 *                 valorCredito: "33483.5"
 *       404:
 *         description: No se encontro informacion
 *       500:
 *         description: Error en la generación de la factura
 *         content:
 *           application/json:
 *             example:
 *               error: "La factura ya está anulada."
 * /output/{id}:
 *   post:
 *     summary: Obtener información de una Factura de Venta
 *     description: |
 *       Este endpoint permite consultar los datos de una factura específica (Salida de Inventario) del almacén.
 *       Requiere autenticación del usuario que generó la factura.
 *     tags:
 *       - Almacen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura a consultar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserInformation
 *             properties:
 *               UserInformation:
 *                 type: object
 *                 description: Datos del usuario que realiza la consulta
 *                 required:
 *                   - UserIdent
 *                   - UserPassword
 *                 properties:
 *                   UserIdent:
 *                     type: string
 *                     description: Identificación del usuario
 *                     example: "1234567890"
 *                   UserPassword:
 *                     type: string
 *                     description: Contraseña del usuario
 *                     example: "pepitoperez123"
 *     responses:
 *       200:
*         description: Información de la factura obtenida correctamente
*         content:
*           application/json:
*             example:
*               ok: true
*               invoice:
*                 id: 1382270
*                 outputInventoryTypeId: 1
*                 paymentFormInventoryId: 3
*                 paymentMethodInventoryId: 3
*                 paymentMeanInventoryId: 3
*                 inventoryTypeBillingId: 3
*                 inventoryOutputStateId: 4
*                 idSucursal: 968
*                 prefijo: "EDSI"
*                 numero: "277624"
*                 prefijoResolucion: "EDSI"
*                 numeroResolucion: "277624"
*                 idPersona: 1128508543
*                 idVehiculo: null
*                 fecMov: "2025-04-22T20:10:11.000Z"
*                 fechaCobro: "2025-04-22T20:10:11.000Z"
*                 valorTotal: "33483.5"
*                 valorAbono: "0"
*                 valorDescuento: "0"
*                 totalImpuesto: "0.00"
*                 valorNeto: "0"
*                 valorImpuesto: "0"
*                 valorDescuentoSinImp: "0.00"
*                 valorDescuentoConImp: "0.00"
*                 saldoActual: "33483.5"
*                 observacion: "Placa: BOP461, Kilometraje : 0.00, Nro Transaccion : 123"
*                 resolucion: null
*                 idUsuarioCre: 395
*                 idUsuarioMod: 395
*                 createdAt: "2025-04-24T20:10:11.000Z"
*                 updatedAt: "2025-04-25T01:10:27.000Z"
*                 razonModificacion: "Prueba"
*                 idEmpresaOperadora: 2
*                 valorNetoSinImp: "33483.5"
*                 porcentajeDescuento: "0"
*                 idTarjetaBanco: null
*                 nroTransaccion: null
*                 softwareExterno: true
*                 externalVehicleId: 81076
*                 dispenserNumber: "1234"
*                 surtidor: "1"
*                 isla: "1"
*                 manguera: "1"
*                 nroCruce: "1234"
*                 prefijoCruce: null
*                 kilometrosVeh: null
*                 valorCredito: "33483.5"
*       401:
*         description: Credenciales inválidas
*       404:
*         description: Factura no encontrada o no pertenece al usuario
*       500:
*         description: Error interno del servidor
*/

router.post('/output', [
    body().notEmpty().withMessage('Campos obligatorios sin enviar'),
    body('UserInformation.UserIdent').notEmpty().withMessage('Debe enviar la identificación del usuario'),
    body('UserInformation.UserPassword').notEmpty().withMessage('Debe enviar la contraseña'),
    body('InvoiceInformation.PosPrefix').notEmpty().withMessage('Debe enviar el prefijo de la factura'),
// y así para otros campos

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
        //await transaction.commit();
        await transaction.rollback();
        return res.status(200).json({ ok: 'Factura simulada en el entorno de pruebas exitosamente.', message : {currentOutput:currentOutput, currentCredit:currentCredit} });

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
        console.log(invoice);
        if (invoice.inventoryOutputStateId === 4) {
            return await safeResponse(res, transaction, 400, { error: 'La factura ya está anulada.' });
        }

        // Preparar fecha actual en formato correcto
        const dbDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const idFactura = invoice.id;

        // Intentar actualizar
        const [affectedRows] = await Output.update(
            { inventoryOutputStateId: 4, updatedAt: dbDate, idUsuarioMod: idUsuario },
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

        await transaction.rollback();
        return res.status(200).json({ ok: 'Factura Simulanda en el proceso de Anulacion con Exito', updatedOutput: updatedOutput });

    } catch (error) {
        await transaction.rollback();
        return await safeResponse(res, transaction, 500, {
            error: 'No se puede anular la factura. Comunicate con soporte en caso de que en el sistema no se encuentre anulada.',
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
            },transaction
        });

        return res.status(200).json({ ok: true, invoice });

    } catch (error) {
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