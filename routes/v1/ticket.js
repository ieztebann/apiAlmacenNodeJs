const axios = require('axios');
const express = require('express');
const EmpresaConvenioTeletiquete = require('../../models/EmpresaConvenioTeletiquete');
const router = express.Router();
const https = require('https');

// Crea una instancia de agente HTTPS que ignora los certificados autofirmados
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


// Ruta POST para la versión 1
router.post('/sell/:idEmpresa', async (req, res) => {
  try {

    // Verifica si el cuerpo de la solicitud está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Modo test: Error al recibir los datos' });
    }

    // Verifica si el parámetro idEmpresa es válido
    const idEmpresa = parseInt(req.params.idEmpresa, 10);
    if (isNaN(idEmpresa)) {
      return res.status(400).json({ error: 'Modo test: ID de empresa no válida' });
    }

    // Busca la empresa por id_empresa
    const empresa = await EmpresaConvenioTeletiquete.findOne({
      where: { id_empresa: idEmpresa }
    });
    if (!empresa) {
      return res.status(404).json({ message: 'Modo test: No se encontró la empresa con la ID proporcionada.' });
    }
    // Usa directamente req.body en lugar de JSON.stringify(req.body)
    const bodyJson = req.body;
    const sendBody = {
      "function_name": 'sellTicketAgreement',
      "parameter": {
        "token": empresa.key_token,
        "in": {
          "nit_empresa": bodyJson.nit_empresa,
          "usuario": bodyJson.parameter.in.usuario,
          "pasajeros": bodyJson.parameter.in.pasajeros,
          "tiquetes": bodyJson.parameter.in.tiquetes,
          "info_ida": bodyJson.parameter.in.info_ida,
          "tipo_compra": bodyJson.parameter.in.tipo_compra
        }
      }
    };
    const externalApiUrl = empresa.apitravel; // Cambia esto por la URL de la otra API
    const externalResponse = await axios.post(externalApiUrl, sendBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      httpsAgent // Pasa el agente HTTPS que ignora la validación de certificados
    });
    // Responder con los datos obtenidos de la API externa
    res.status(200).json({ message: 'Modo test: Respuesta de la API externa', data: externalResponse.data });

  } catch (error) {
    res.status(500).json({ error: 'Modo test: Error al obtener datos de PostgreSQL', data: error });
  }
});


module.exports = router;
