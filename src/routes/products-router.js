import express from 'express';
import { Pmanager } from '../managers/products-manager.js';
import { productValidator } from '../middlewares/product-validator.js';
import exp from 'node:constants';

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

router.post ('/', productValidator, async (req, res, next) => {
    try {
    const product = await Pmanager.createProduct(req.body);
    res.status(201).json({ message: "Producto creado", data: req.body });res.status(201).json(product);
    } catch (error) {
    next(error);
    }
});

router.put ('/:id', productValidator, async (req, res, next) => {
    try {
    const product = await Pmanager.updateProduct(req.params.id, req.body);
    res.json(product);
    } catch (error) {
    next(error);
    }
}   );

router.delete ('/:id', async (req, res, next) => { 
    try {
    const product = await Pmanager.deleteProduct(req.params.id);
    res.json(product);
    } catch (error) {
    next(error);
    }
});

export { router as productsRouter };