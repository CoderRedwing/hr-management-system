const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HR Management Portal API',
      version: '1.0.0',
      description: 'API documentation for HR Management System',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // ✅ ensure correct path
};

module.exports = swaggerOptions;
