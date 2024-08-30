import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './router/Router'; 
import path from 'path';// Import your router

const app = express();
const port = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Prospecting API',
      version: '0.1.0',
      description: 'API documentation for Moneta Prospecting APP',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: [path.join(__dirname, './router/Router.ts')]// Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Swagger setup
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
