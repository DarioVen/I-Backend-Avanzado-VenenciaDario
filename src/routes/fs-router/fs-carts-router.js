import express from 'express';
import { Cmanager } from '../../controllers/managers/carts-manager.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const cart = await Cmanager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const cart = await Cmanager.getCart(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/products/:pid', async (req, res, next) => {
    try {
        const { id, pid } = req.params; 
        const cart = await Cmanager.addProductToCart(id, { id: pid }); 
        res.json(cart);
    } catch (error) {
        next(error);
    }
});


export { router as fsCartsRouter };