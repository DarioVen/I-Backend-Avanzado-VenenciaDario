import express from 'express';
import { Pmanager } from '../../controllers/managers/products-manager.js';
import { productValidator } from '../../middlewares/product-validator.js';
import { socketMiddleware } from '../../middlewares/socket-middleware.js';

export const fsProductsRouter = (socketServer) => {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        try {
            const products = await Pmanager.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            const product = await Pmanager.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    });

    router.post('/', socketMiddleware, productValidator, async (req, res, next) => {
        try {
            const product = await Pmanager.createProduct(req.body);

            if (req.fromSocket) {
                const updatedProducts = await Pmanager.getAllProducts();
                socketServer.emit("productCreated", product);
                socketServer.emit("arrayProducts", updatedProducts);
                console.log("Producto creado router");
            }

            res.status(201).json({ message: "Producto creado", data: product });
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', productValidator, async (req, res, next) => {
        try {
            const product = await Pmanager.updateProduct(req.params.id, req.body);
            res.json(product);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:id', socketMiddleware, async (req, res, next) => {
        try {
            const product = await Pmanager.deleteProduct(req.params.id);

            if (req.fromSocket) {
                const updatedProducts = await Pmanager.getAllProducts();
                socketServer.emit("productDeleted", product);
                socketServer.emit("arrayProducts", updatedProducts);
            }

            res.json(product);
        } catch (error) {
            next(error);
        }
    });

    return router;
};