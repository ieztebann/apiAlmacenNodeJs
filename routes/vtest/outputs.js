const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Usuario, Persona, Sucursal } = require('../../models'); // Importa tus modelos de Sequelize
const { PersonController, UtilController, ProductController } = require('./controller');  // Importa la función de validación

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
 *             properties:
 *               infoGeneral:
 *                 type: object
 *                 properties:
 *                   IdSucursal:
 *                     type: integer
 *                     example: 1
 *                   IdentificacionUsuario:
 *                     type: string
 *                     example: "1234567890"
 *                   ContraseñaUsuario:
 *                     type: string
 *                     example: "pepitoperez123"
 *               infoEstacion:
 *                 type: object
 *                 properties:
 *                   Surtidor:
 *                     type: string
 *                     example: "11A"
 *                   Cara:
 *                     type: string
 *                     example: "21B"
 *                   Manguera:
 *                     type: string
 *                     example: "02C"
 *               infoFacturaVenta:
 *                 type: object
 *                 properties:
 *                   Consecutivo:
 *                     type: integer
 *                     example: 123
 *                   paymentForm:
 *                     type: integer
 *                     example: 2
 *                   FechaFacturacion:
 *                     type: string
 *                     example: "2024-09-01"
 *                   Detalles:
 *                     type: string
 *                     example: "2024-09-01"
 *                   infoVehiculo:
 *                     type: object
 *                     properties:
 *                       Placa:
 *                          type: string
 *                          example: "BOP461"
 *                       FechaUltimoMantenimiento:
 *                          type: string
 *                          example: "2024-01-01"
 *                       FechaProximoMantenimiento:
 *                          type: string
 *                          example: "2024-01-01"  
 *                       Kilometraje:
 *                          type: string
 *                          example: ""  
 *                       Modelo:
 *                          type: string
 *                          example: ""  
 *                       Marca:
 *                          type: string
 *                          example: ""   
 *                       Linea:
 *                          type: string
 *                          example: ""   
 *                       Tag:
 *                          type: string
 *                          example: ""  
 *                   infoTercero:
 *                     type: object
 *                     properties:
 *                       TipoIdentificacion:
 *                          type: integer
 *                          example: 1
 *                       Identificacion:
 *                          type: string
 *                          example: "1016943625"
 *                       Nombre:
 *                          type: string
 *                          example: "Esteban"  
 *                       PrimerApellido:
 *                          type: string
 *                          example: "Bohorquez"  
 *                       SegundoApellido:
 *                          type: string
 *                          example: "Rodriguez"  
 *                       Direccion:
 *                          type: string
 *                          example: "Carrera 17 # 71 - 07"   
 *                       Correo:
 *                          type: string
 *                          example: "esteban@gmail.com"   
 *                       Celular:
 *                          type: string
 *                          example: "3026660606"   
 *                   infoProducto:
 *                     type: object
 *                     properties:
 *                       IdProduct:
 *                          type: integer
 *                          example: 1
 *                       Cantidad:
 *                          type: numeric
 *                          example: 1
 *                       Precio:
 *                          type: numeric
 *                          example: 10000  
 *                       Descuento:
 *                          type: numeric
 *                          example: 0   
 *                       Iva:
 *                          type: numeric
 *                          example: 0  
 *                       Subtotal:
 *                          type: numeric
 *                          example: 10000  
 *                       Total:
 *                          type: numeric
 *                          example: 10000 
 *                   infoPago:
 *                     type: object
 *                     properties:
 *                       FormaPago:
 *                          type: integer
 *                          example: 123
 *                       MedioPago:
 *                          type: string
 *                          example: "2024-01-01"
 *                       TipoTarjeta:
 *                          type: string
 *                          example: "2024-01-01"  
 *                       NroTransaccion:
 *                          type: number
 *                          format: float
 *                          example: 59.99
 *     responses:
 *       200:
 *         description: Listados encontrados
 *       404:
 *         description: Listados no encontrados
 *       500:
 *         description: Error en el servicio
 */

router.post('/outputs', [
    body().notEmpty().withMessage('Campos obligatorios sin enviar'),
], async (req, res) => {
    let datosEntrada;
    datosEntrada = req.body;   
    // Iniciar una transacción
    const transaction = await sequelize.transaction();
    try {        

        //
        const { infoFacturaVenta } = datosEntrada;            
        const { infoFacturaVenta: { infoTercero: datosTercero } } = datosEntrada;
        const { infoFacturaVenta: { infoProducto: datosProducto } } = datosEntrada;
        const { infoGeneral } = datosEntrada;

        // Verificar si el usuario existe
        let idUsuario = 0;

        if (!infoGeneral.IdentificacionUsuario) {
            return res.status(400).json({ error: 'Identificacion del usuario Incompleta' });
        }
        if (!infoGeneral.ContraseñaUsuario) {
            return res.status(400).json({ error: 'Contraseña del usuario Incompleta' });
        }
        const usuarioActivo = await Usuario.findOne({
            where: {
                activo: true,
                nro_cedula: infoGeneral.IdentificacionUsuario
            }
        });

        if (!usuarioActivo) {
            return res.status(404).json({ error: `Credenciales invalidas` });
        }  
        
        const isValidPasswd = await UtilController.passwordValidate(infoGeneral.ContraseñaUsuario, usuarioActivo.password);
        if (!isValidPasswd) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
        idUsuario = usuarioActivo.id;
        
        if (!infoFacturaVenta) {
            return res.status(400).json({ error: 'Campos de la Factura obligatorios sin enviar' });
        }
        if (!datosTercero) {
            return res.status(400).json({ error: 'Campos del Tercero obligatorios sin enviar' });
        }
        if (!datosProducto) {
            return res.status(400).json({ error: 'Campos del Producto obligatorios sin enviar' });
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

        if (!infoGeneral.IdSucursal) {
            return res.status(400).json({ error: 'Debe enviar la sucursal' });
        }
        
        const sucursal = await Sucursal.findOne({
            where: {
                id_est_registro: 1,
                id_tipo_sucursal: 7,
                id_sucursal: infoGeneral.IdSucursal,
            }
        });

        if (!sucursal) {
            return res.status(404).json({ error: `Sucursal invalida, consulte los listados` });
        }
        const idSucursal = sucursal.id_sucursal;
        let idPersona = 0;


        // ## Fill Person Object Initiation 
        const personData = await PersonController.fillPerson(datosTercero,idUsuario,dbDate);                
        // ## Validate Person Information and Structure Initiation 
        const validatePerson = await PersonController.validatePerson(personData);        
        // ## Create or Modify Person Initiation with transaction
        const currentPerson = await PersonController.managePerson(personData,idUsuario,dbDate,transaction);
        idPersona = currentPerson.id;       
        
        
        // ## Fill Product Object Initiation 
        const productData = await ProductController.fillProduct(datosProducto); 
        // ## Validate Person Information and Structure Initiation 
        const validateProduct = await ProductController.validateProduct(productData);      
        
        await transaction.rollback();                
        //await transaction.commit();

        return res.status(200).json({ message: 'Factura generada exitosamente', productData });
    } catch (error) {
        await transaction.rollback();
        if(error.message){
            return res.status(500).json({ error: 'Se ha presentado un problema', message : error.message  });            
        }
        return res.status(500).json({ error: 'Formato de datos no válido', data : error  });
    }
});

module.exports = router;
