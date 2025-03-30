import { cartService } from "../services/cart-services.js";
import CustomError from "../utils/custom-error.js";

class CartController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const carts = await this.service.getAll();
      res.status(200).json(carts);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cart = await this.service.getCartByID(id);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { userId } = req.body; 
      const newCart = await cartService.create(userId ? { userId } : {});
      res.status(201).json({
        success: true,
        cart: newCart
      });
    } catch (error) {
      next(error);
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedCart = await this.service.update(id, req.body);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCart = await this.service.delete(id);
      res.status(200).json(deletedCart);
    } catch (error) {
      next(error);
    }
  };

  addProduct = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;
      const result = await this.service.addProductToCart(cartId, productId, quantity);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  removeProduct = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      const result = await this.service.deleteProductFromCart(cartId, productId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProductQuantity = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (!quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'La cantidad es requerida'
        });
      }

      const updatedCart = await this.service.updateProductQuantity(cid, pid, quantity);
      
      res.json({
        status: 'success',
        payload: updatedCart
      });
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const result = await this.service.clearCart(cid);
      
      res.json({
        status: 'success',
        payload: result,
        message: 'All products removed from cart'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const cartController = new CartController(cartService);