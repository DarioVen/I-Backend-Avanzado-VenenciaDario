import { CartModel } from "./models/cart-model.js";
import MongoDao from "./mongo-dao.js";
import { Types } from "mongoose";

class CartsDao extends MongoDao {
  constructor() {
    super(CartModel);
  }

  getCartByID = async (id) => {
    try {
      return await this.model.findById(id).populate('products');
    } catch (error) {
      throw new Error(error);
    } 
  }

  create = async (cartData = {}) => {
    try {
      // Si no se provee userId, el esquema lo generará automáticamente
      return await this.model.create(cartData);
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  
  addProductToCart = async (cartId, productId, quantity = 1) => {
    try {
      const productObjectId = new Types.ObjectId(productId);
      
      return await this.model.findOneAndUpdate(
        { _id: cartId },
        { 
          $addToSet: { 
            products: { 
              product: productObjectId,
              quantity: Number(quantity)
            } 
          } 
        },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const productObjectId = new Types.ObjectId(productId);
      
      return await this.model.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productObjectId } } },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const result = await this.model.findOneAndUpdate(
        { 
          _id: cartId,
          "products.product": productId 
        },
        { 
          $set: { "products.$.quantity": quantity } 
        },
        { 
          new: true 
        }
      ).populate('products.product');
      
      if (!result) {
        throw new Error('Carrito o producto no encontrado');
      }
      
      return result;
    } catch (error) {
      throw new Error(`Error en DAO: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const result = await this.model.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } }, 
        { new: true }
      ).populate('products.product');
      
      if (!result) {
        throw new Error('Cart not found');
      }
      
      return result;
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }
}
export const cartDao = new CartsDao();