import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { Pmanager as productManager } from './products-manager.js';

class CartsManager {
    constructor(path) {
        this.path = path;
    }
    async getAllCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(carts);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    async createCart() {
        try {
            const cart = {
                id: uuidv4(),
                products: [],
            };
            const carts = await this.getAllCarts();
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return cart;
        } catch (error) {
            throw error;
        }
    }
    async getCart(id) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === id);
    }
    async addProductToCart(cartId, product) { 
        try {
            let carts = await this.getAllCarts();
            let cart = carts.find(c => c.id === cartId);
            if (!cart) {
                cart = { id: cartId, products: [] };
                carts.push(cart);
            }
            const productExists = await productManager.getProductById(product.id);
            if (!productExists) {
                throw new Error("Product not found");
            }
            const productIndex = cart.products.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                const cartProduct = {
                    id: product.id,
                    quantity: 1,
                };
                cart.products.push(cartProduct);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts)); 
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export const Cmanager = new CartsManager("carts.json");