import { cartDao } from "../daos/mongodb/carts-dao.js";
import CustomError from "../utils/custom-error.js"

class CartService {
  constructor(dao) {
      this.dao = dao;
  }

  getAll = async () => {
      try {
          return await this.dao.getAll();
      } catch (error) {
          throw new Error(error);
      }
  }

  getCartByID = async (id) => {
      try {
          return await this.dao.getCartByID(id);
      } catch (error) {
          throw new Error(error);
      }
  }

  create = async (cartData = {}) => { 
    try {
        return await this.dao.create(cartData);
    } catch (error) {
        throw new CustomError('Error creating cart', 500, error.message);
    }
}


  update = async (id, obj) => {
      try {
          return await this.dao.update(id, obj);
      } catch (error) {
          throw new Error(error);
      }
  }

  delete = async (id) => {
      try {
          return await this.dao.delete(id);
      } catch (error) {
          throw new Error(error);
      }
  }

  addProductToCart = async (cartId, productId, quantity) => {
    try {
        const qty = Number(quantity) || 1;
        return await this.dao.addProductToCart(cartId, productId, qty);
      } catch (error) {
          throw new Error(error);
      }
  }

  deleteProductFromCart = async (cartId, productId) => {
      try {
          return await this.dao.deleteProductFromCart(cartId, productId);
      } catch (error) {
          throw new Error(error);
      }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (isNaN(quantity) || quantity < 1) {
        throw new Error('La cantidad debe ser un número mayor a 0');
      }
      
      return await this.dao.updateProductQuantity(
        cartId, 
        productId, 
        Number(quantity)
      );
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      if (!cartId) {
        throw new Error('Cart ID is required');
      }
      
      return await this.dao.clearCart(cartId);
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }
}

export const cartService = new CartService(cartDao);