import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import http from 'http';
import { initMongoDB } from './daos/mongodb/connection.js'; 

import viewsRouter from './routes/views-router.js';
import { productsRouter } from './routes/products-router.js'; 
import { cartsRouter } from './routes/carts-router.js';
import { configureSocket } from './socketServer.js';

const app = express();

// Configuración básica de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(`${process.cwd()}/src/public`)));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(process.cwd(), 'src/views'));
app.set('view engine', 'handlebars');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Inicialización del servidor
const httpServer = http.createServer(app);

// Configuración de Socket.io
const socketServer = configureSocket(httpServer);

// Conexión a MongoDB
initMongoDB()
    .then(() => console.log("Base de datos Mongo conectada"))
    .catch((error) => console.log(error));

// Inicio del servidor
httpServer.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});