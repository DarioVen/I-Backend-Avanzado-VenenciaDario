
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

import viewsRouter from './routes/views-router.js';
import { configureProductsRouter } from './routes/products-router.js';
import { cartsRouter } from './routes/carts-router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(`${process.cwd()}/src/public`)));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(process.cwd(), 'src/views'));
app.set('view engine', 'handlebars');

const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

const productsRouter = configureProductsRouter(socketServer);
app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

httpServer.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});

const productsFilePath = path.join(process.cwd(), 'src', 'products.json');

function readProducts() {
    try {
        if (!fs.existsSync(productsFilePath)) {
            return [];
        }
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading products file:", error.message);
        return [];
    }
}

socketServer.on('connection', (socket) => {
    const products = readProducts();
    
    socket.emit("arrayProducts", products);

    socket.on('createProduct', async (productData) => {
        try {
            productData.fromSocket = true;

            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                console.log('Producto creado a través de Socket.io');

                const updatedProducts = await fetch('http://localhost:8080/api/products').then(res => res.json());

                socketServer.emit('arrayProducts', updatedProducts);
            } else {
                const errorData = await response.json();
                socket.emit('productCreationError', errorData.message);
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
            socket.emit('productCreationError', 'Error interno del servidor');
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Producto eliminado a través de Socket.io');

                const updatedProducts = await fetch('http://localhost:8080/api/products').then(res => res.json());

                socketServer.emit('arrayProducts', updatedProducts);
            } else {
                const errorData = await response.json();
                socket.emit('productDeletionError', errorData.message);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            socket.emit('productDeletionError', 'Error interno del servidor');
        }
    });
});

