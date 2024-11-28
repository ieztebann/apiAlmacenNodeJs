const express = require('express');
const EmpresaConvenioTeletiquete = require('../../models/EmpresaConvenioTeletiquete');
const router = express.Router();

// Ruta GET para la versión 1
router.get('/agreement/:idEmpresa', async (req, res) => {
  try {
    const idEmpresa = parseInt(req.params.idEmpresa, 10);
    if (isNaN(idEmpresa)) {
      return res.status(400).json({ error: 'Modo test: ID de empresa no válida' });
    }
    const empresa = await EmpresaConvenioTeletiquete.findOne({
      where: { id_empresa: idEmpresa }
    });
    if (empresa) {
      res.status(200).json({ message: 'Modo test: Empresa encontrada (v1)', data: empresa });
    } else {
      res.status(200).json({ message: 'Modo test: No se encontró la empresa con la ID proporcionada.', data: null });
    }
  } catch (error) {
    res.status(500).json({ error: 'Modo test: Error al obtener datos de PostgreSQL', data: error });
  }
});

module.exports = router;
