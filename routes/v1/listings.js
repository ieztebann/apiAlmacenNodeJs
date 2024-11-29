const express = require('express');
const router = express.Router();
const https = require('https');
const { Op } = require('sequelize');
const { ProductDetails, PaymentFormInventories, TarjetaBanco, TipoDocIdentificacion, Sucursal } = require('../../models');

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Obtener Listados generales y referencias
 *     description: |
 *       Este endpoint permite obtener una lista de códigos generales disponibles en el sistema. 
 *       Es útil para consultar información categorizada que puede ser utilizada en diversas operaciones en los endpointss.
 *     tags:
 *       - Listados  
 *     responses:
 *       200:
 *         description: Listados encontrados
 *       404:
 *         description: Listados no encontrados
 *       500:
 *         description: Error en el servicio
 */
router.get('/listings', async (req, res) => {
    try {
        const datosEntrada = req.body; // Recibe los datos del cuerpo de la solicitud (JSON)
        let response = {};
        /*Branch*/
        let officeBranch = await Sucursal.findAll({
            where: {
                [Op.and]: [
                    { id_tipo_sucursal: 7 },
                    { id_est_registro: 1 }
                ]
            },
            order: [['id_sucursal', 'ASC'], ['nom_sucursal', 'ASC']]
        });
        if (officeBranch.length > 0) {
            response.officeBranch = officeBranch.map(tarjeta => ({
                id: tarjeta.id,
                name: tarjeta.name
            }));
        }
        
        /*Bank Cards*/
        let BankCards = await TarjetaBanco.findAll({
            where: {
                [Op.and]: [
                    { app_eds: true },
                    { id_est_registro: 1 }
                ]
            },
            order: [['id_tarjeta_banco', 'ASC'], ['nombre', 'ASC']]
        });
        if (BankCards.length > 0) {
            response.bankCards = BankCards.map(tarjeta => ({
                id: tarjeta.id,
                name: tarjeta.name
            }));
        }
        
        /*identification Types*/
        let identificationTypes = await TipoDocIdentificacion.findAll({
            where: { 
                id_est_registro: 1 
            },
            order: [['nom_tipo_doc_identificacion', 'ASC']]
        });

        if (identificationTypes.length > 0) {
            response.identificationTypes = identificationTypes.map(identificacion => ({
                id: identificacion.id,
                name: identificacion.name
            }));
        }

        /*Products*/
        let filterProduct = datosEntrada?.filter_product || { apply_app: true };

        let products = await ProductDetails.findAll({
            where: filterProduct,
            order: [['id', 'ASC']],
            schema: 'almacen'
        });

        if (products.length > 0) {
            response.products = products.map(product => ({
                id: product.id,
                name: product.name
            }));
        }

        /*Payment Methods*/
        
        let paymentMethods = await PaymentFormInventories.findAll({
            order: [['id', 'ASC']],
            schema: 'almacen'
        });

        if (paymentMethods.length > 0) {
            response.paymentMethods = paymentMethods.map(paymentMethod => ({
                id: paymentMethod.id,
                name: paymentMethod.name
            }));
        }

        // Enviar respuesta con los datos obtenidos
        return res.status(200).json(response);

    } catch (error) {
        // Manejo de errores
        if(error.message){
            return res.status(500).json({ error: 'Error al obtener datos', data: error.message });            
        }
        
        return res.status(500).json({ error: 'Error al obtener datos', data: error });        
    }
});

module.exports = router;
