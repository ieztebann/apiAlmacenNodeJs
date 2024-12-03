const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Usuario, Persona, Sucursal } = require('../../models'); // Importa tus modelos de Sequelize
const { PersonController, UtilController, ProductController, OutputController, VehicleController, PaymentController } = require('./controller');  // Importa la función de validación

const app = express();
const sequelize = require('../../config/database');


app.use(express.json()); // Asegúrate de tener este middleware para manejar JSON
/**
 * @swagger
 * /outputs:
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
 *                   DianPrefix:
 *                     type: string
 *                     description: "Prefijo resolucion DIAN"
 *                     example: "DIAN"
 *                   DianConsecutive:
 *                     type: integer
 *                     description: "Consecutivo resolucion DIAN"                  
 *                     example: 1234
 *                   PosPrefix:
 *                     type: string
 *                     example: "POS"                    
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
 *                          type: string
 *                          example: "LWY535"
 *                       LastMaintenanceDate:
 *                          type: string
 *                          example: "2024-07-11"
 *                       NextMaintenanceDate:
 *                          type: string
 *                          example: "2025-07-11"  
 *                       Mileage:
 *                          type: string
 *                          example: "125.40" 
 *                   InvoiceHolderInformation:
 *                     type: object
 *                     properties:
 *                       TypeId:
 *                          type: integer
 *                          example: 6
 *                       Id:
 *                          type: string
 *                          example: "890200218"
 *                       Name:
 *                          type: string
 *                          example: "Cotaxi"  
 *                       FirstLastName:
 *                          type: string
 *                          example: ""  
 *                       SecondLastName:
 *                          type: string
 *                          example: ""  
 *                       Adress:
 *                          type: string
 *                          example: "CRA 19 16-58 Bucaramanga"   
 *                       Email:
 *                          type: string
 *                          example: "clientesyproovedorescotaxi@gmail.com"   
 *                       PhoneNumber:
 *                          type: string
 *                          example: "3021234567"   
 *                   ProductInformation:
 *                     type: object
 *                     properties:
 *                       ProductId:
 *                          type: integer
 *                          example: 4
 *                       Quantity:
 *                          type: float
 *                          example: 74.670
 *                       Price:
 *                          type: float
 *                          example: 8900.000  
 *                       Discunt:
 *                          type: float
 *                          format: float
 *                          example: 0   
 *                       Iva:
 *                          type: float
 *                          format: float                          
 *                          example: 0  
 *                       Subtotal:
 *                          type: float
 *                          format: float
 *                          example: 664563  
 *                       Total:
 *                          type: float
 *                          example: 664563 
 *                   PaymentInformation:
 *                     type: object
 *                     properties:
 *                       PaymentFormId:
 *                          type: integer
 *                          example: 1  
 *                       PaymentMethodId:
 *                          type: integer
 *                          example: 1  
 *                       CardId:
 *                          type: integer
 *                          example: 1  
 *                       TransaccionNumber:
 *                          type: number
 *                          example: 100
 *     responses:
 *       200:
 *         description: Factura Generada
 *       404:
 *         description: No se encontro informacion
 *       500:
 *         description: Error en la generacion de la factura
 */

router.post('/outputs', [
    body().notEmpty().withMessage('Campos obligatorios sin enviar'),
], async (req, res) => {
    let datosEntrada;
    datosEntrada = req.body;   
    // Iniciar una transacción
    const transaction = await sequelize.transaction();
    try {        
        
        const { InvoiceInformation, UserInformation } = datosEntrada;            
        const { InvoiceInformation: { ProductInformation: datosProducto, VehicleInformation: datosVehiculo, PaymentInformation : datosPago, InvoiceHolderInformation: datosTercero } } = datosEntrada;

        // Verificar si el usuario existe
        let idUsuario = 0;

        if (!UserInformation.UserIdent) {
            return res.status(400).json({ error: 'Identificacion del usuario Incompleta' });
        }
        if (!UserInformation.UserPassword) {
            return res.status(400).json({ error: 'Contraseña del usuario Incompleta' });
        }
        const usuarioActivo = await Usuario.findOne({
            where: {
                activo: true,
                nro_cedula: UserInformation.UserIdent
            }
        });

        if (!usuarioActivo) {
            return res.status(404).json({ error: `Credenciales invalidas` });
        }  
        
        const isValidPasswd = await UtilController.passwordValidate(UserInformation.UserPassword, usuarioActivo.password);
        if (!isValidPasswd) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
        idUsuario = usuarioActivo.id;
        
        if (!InvoiceInformation) {
            return res.status(400).json({ error: 'Campos de la Factura obligatorios' });
        }
        if (!datosTercero) {
            return res.status(400).json({ error: 'Campos del Tercero obligatorios' });
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
        const idSucursal = sucursal.id_sucursal;
        let idPersona = 0;


        // ## Fill Person Object Initiation 
        const personData = await PersonController.fillPerson(datosTercero,idUsuario,dbDate);                
        const validatePerson = await PersonController.validatePerson(personData);        
        const currentPerson = await PersonController.managePerson(personData,idUsuario,dbDate,transaction);
        idPersona = currentPerson.id;       
        
        // ## Product
        const productData = await ProductController.fillProduct(datosProducto); 
        const validateProduct = await ProductController.validateProduct(productData); 
        
        // ## Vehicle   
        let vehicleData;
        let validateVehicle;
        let currentVehicle;
        
        if(datosVehiculo){
            vehicleData = await VehicleController.fillVehicle(datosVehiculo); 
            validateVehicle = await VehicleController.validateVehicle(vehicleData);      
            currentVehicle = await VehicleController.manageVehicle(vehicleData, idPersona, idUsuario, transaction);         
        }
               
        const paymentData = await PaymentController.fillPayment(datosPago); 
        const validatePayment = await PaymentController.validatePayment(paymentData); 
        const currentPayment = await PaymentController.getPayment(paymentData);         
        
        await transaction.rollback();                            
        return res.status(200).json({ message: 'Factura generada exitosamente', currentPayment });
        const outputData = await OutputController.fillOutput(currentPerson,productData,currentVehicle,InvoiceInformation); 

        //const creditData = await CreditController.Credit(datosProducto); 
        
        //await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        if(error.message){
            return res.status(500).json({ error: 'Se ha presentado un problema', message : error.message  });            
        }
        return res.status(500).json({ error: 'Formato de datos no válido', data : error  });
    }
});

module.exports = router;
