import { Router } from "express";
import { Pmanager } from '../managers/products-manager.js';

const router = Router();

router.get('/home', async (req, res) => {
    try {
        console.log('Obteniendo productos...');
        const products = await Pmanager.getAllProducts();
        console.log('Productos obtenidos:', products); 
        res.render('home', { products }); 
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts');
});

export default router;