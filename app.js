const express = require('express');
const compression = require('compression');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(compression());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'Documentacion de API SILOG. EBRv1.0.0',
        },
        servers: [
            {
                url: process.env.HTTPS_API+'/almacen/api/v1',
            },
            {
                url: process.env.HTTPS_API+'/almacen/api/vtest',
            },
        ],
    },
    apis: ['./routes/**/*.js'], // Asegúrate de que esta ruta apunte a todos los archivos de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/silog/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Rutas de la API vTest
const vTestListingsRoutes = require('./routes/vtest/listings');
const vTestOutputsRoutes = require('./routes/vtest/outputs');
app.use('/api/vtest', vTestListingsRoutes);//Listings
app.use('/api/vtest', vTestOutputsRoutes);

// Rutas de la API v1
const v1ListingsRoutes = require('./routes/v1/listings');
const v1OutputsRoutes = require('./routes/v1/outputs');
app.use('/api/v1', v1ListingsRoutes);
app.use('/api/v1', v1OutputsRoutes);


app.listen(process.env.HTTPS_PORT, () => {
  console.log(`Worker ${process.pid} started, API listening on port 3021`);
});

