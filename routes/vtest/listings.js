const express = require('express');
const router = express.Router();
const https = require('https');
const { Op } = require('sequelize');
const { ProductDetails, PaymentFormInventories,PaymentMethodInventories,PaymentMeanInventories, TarjetaBanco, TipoDocIdentificacion, Sucursal } = require('../../models');

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Obtener Listados generales y referencias
 *     description: |
 *       Este endpoint permite obtener una lista de códigos generales disponibles en el sistema. 
 *       Es útil para consultar información categorizada que puede ser utilizada en diversas operaciones en los endpoints.
 *     tags:
 *       - Listados  
 *     responses:
 *       200:
 *         description: Listados encontrados (Esta informacion es ficticia, la informacion correcta esta al consumir el servicio)
 *         content:
 *           application/json:
 *             example:
 *               officeBranch:
 *                 - id: 101
 *                   name: ESTACION DE SERVICIO HUILA
 *                 - id: 102
 *                   name: ESTACION DE SERVICIO CARTAGENA
 *                 - id: 103
 *                   name: BODEGA MEDELLIN 1A
 *                 - id: 104
 *                   name: TIENDA CUCUTA 2B
 *               bankCards:
 *                 - id: 1
 *                   name: VISA
 *                 - id: 2
 *                   name: DINNERS CLUB
 *                 - id: 3
 *                   name: AMERICAN EXPRESS
 *                 - id: 4
 *                   name: DEBITO
 *                 - id: 5
 *                   name: OTRAS TARJETAS
 *               identificationTypes:
 *                 - id: 3
 *                   name: C.C
 *                 - id: 5
 *                   name: C.E
 *                 - id: 6
 *                   name: NIT
 *                 - id: 7
 *                   name: PASAPORTE
 *               products:
 *                 - id: 3
 *                   name: GASOLINA CORRIENTE OXIGENADA
 *                 - id: 4
 *                   name: GASOLINA EXTRA
 *                 - id: 6
 *                   name: CELERITY 2T BIO ANTIHUMO 1/4
 *                 - id: 7
 *                   name: CELERITY 2T BIO ANTIHUMO PINTA
 *               paymentForms:
 *                 - id: 1
 *                   name: CONTADO
 *                   paymentMethods:
 *                     - id: 1
 *                       name: EFECTIVO
 *                       paymentMeans:
 *                         - id: 1
 *                           name: EFECTIVO
 *                     - id: 2
 *                       name: TRANSFERENCIA ELECTRONICA
 *                       paymentMeans:
 *                         - id: 2
 *                           name: DAVIPLATA
 *                         - id: 5
 *                           name: TARJETA CREDITO
 *                         - id: 6
 *                           name: QR
 *                         - id: 7
 *                           name: NEQUI
 *                         - id: 8
 *                           name: TARJETA DEBITO
 *                 - id: 3
 *                   name: CREDITO
 *                   paymentMethods:
 *                     - id: 3
 *                       name: CREDITO
 *                       paymentMeans:
 *                         - id: 3
 *                           name: CREDITO
 *                 - id: 8
 *                   name: PAGO MULTIPLE
 *                   paymentMethods: []
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
        let filterProduct = datosEntrada && datosEntrada.filter_product || { apply_app: true };

        let products = await ProductDetails.findAll({
            where: filterProduct,
            order: [['id', 'ASC']],
            schema: 'almacen'
        });

        if (products.length > 0) {
            response.products = products.map(product => ({
                id: product.id,
                cod_product: product.cod_product,
                name: product.name
            }));
        }

        let filterForms = datosEntrada && datosEntrada.filter_forms || { register_status_id: 1 };
        let filterMethods = datosEntrada && datosEntrada.filter_methods || { register_status_id: 1 };
        let filterMeans = datosEntrada && datosEntrada.filter_means || { register_status_id: 1 };
        
        // Obtener todos
        const [paymentForms, paymentMethods, paymentMeans] = await Promise.all([
            PaymentFormInventories.findAll({
                where: filterForms,
                order: [['id', 'ASC']],
                schema: 'almacen'
            }),
            PaymentMethodInventories.findAll({
                where: filterMethods,
                order: [['id', 'ASC']],
                schema: 'almacen'
            }),
            PaymentMeanInventories.findAll({
                where: filterMeans,
                order: [['id', 'ASC']],
                schema: 'almacen'
            })
        ]);
        
        // Agrupar medios por método
        const mediosPorMetodo = {};
        paymentMeans.forEach(m => {
            if (!mediosPorMetodo[m.payment_method_inventory_id]) {
                mediosPorMetodo[m.payment_method_inventory_id] = [];
            }
            mediosPorMetodo[m.payment_method_inventory_id].push({
                id: m.id,
                name: m.name
            });
        });
        
        // Agrupar métodos por forma
        const metodosPorForma = {};
        paymentMethods.forEach(m => {
            if (!metodosPorForma[m.payment_form_inventory_id]) {
                metodosPorForma[m.payment_form_inventory_id] = [];
            }
            metodosPorForma[m.payment_form_inventory_id].push({
                id: m.id,
                name: m.name,
                paymentMeans: mediosPorMetodo[m.id] || []
            });
        });
        
        // Construir la respuesta final
        response.paymentForms = paymentForms.map(f => ({
            id: f.id,
            name: f.name,
            paymentMethods: metodosPorForma[f.id] || []
        }));   

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
