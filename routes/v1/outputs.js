const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Usuario, Persona, Sucursal } = require('../../models'); // Importa tus modelos de Sequelize
const { PersonController, UtilController, ProductController } = require('./controller');  // Importa la función de validación

const app = express();
const sequelize = require('../../config/database');


app.use(express.json()); // Asegúrate de tener este middleware para manejar JSON
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
        
        await transaction.commit();

        return res.status(200).json({ message: 'Factura generada exitosamente', currentPerson,idPersona });
    } catch (error) {
        await transaction.rollback();
        
        if(error.message){
            return res.status(500).json({ error: 'Se ha presentado un problema', message : error.message  });            
        }
        return res.status(500).json({ error: 'Formato de datos no válido', data : error  });
    }
});

module.exports = router;
