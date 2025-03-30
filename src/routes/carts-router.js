import { Router } from 'express';
import { cartController } from '../controllers/carts-controller.js';

const router = Router();

router.get('/', cartController.getAll);
router.get('/:id', cartController.getById);
router.post('/', cartController.create);
router.put('/:id', cartController.update);
router.delete('/:id', cartController.delete);
router.post('/:cartId/products/:productId', cartController.addProduct);
router.delete('/:cartId/products/:productId', cartController.removeProduct);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/clear/:cid', cartController.clearCart);

export { router as cartsRouter };