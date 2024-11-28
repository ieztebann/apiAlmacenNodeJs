const os = require('os');

module.exports = {
  apps: [
    {
      name: 'cotaxi-apialmacen',                // Nombre de tu aplicación
      script: './app.js',         // Ruta del script que quieres ejecutar
      exec_mode: 'cluster',       // Usamos el modo 'cluster'
      //instances: 1, // Usar la mitad de los núcleos -- hay 80
      autorestart: true,          // Reiniciar si la aplicación falla
      watch: false,               // Puedes activar el modo watch si es necesario
      max_memory_restart: '1G',   // Limitar el uso de memoria (opcional)
      env: {                      // Variables de entorno
        NODE_ENV: 'production',
        PG_USER:'usersilog',
        PG_HOST:'184.107.185.199',
        PG_DATABASE:'silogcootranshuilaerpdb5',
        PG_PASSWORD:'ViVooO72OyOA6cac2NNy',
        PG_PORT:15250,
        HTTPS_PORT:3021,
        HTTPS_API:'https://apicootranshuilaerp.serviciosproductivos.com.co'
      },
    },
  ],
};

