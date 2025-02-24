import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';

class ProductsManager {
    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error en getAllProducts:', error);
            throw new Error(error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            throw error;
        }
    }

    async createProduct(obj) {
        try {
            const product = {
                id: uuidv4(),
                status: true,
                thumbnails: [],
                ...obj,
            };
            const products = await this.getAllProducts();
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); 
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, obj) { 
        try {
            const products = await this.getAllProducts();
            const productIndex = products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                throw new Error("Product not found");
            }

            const updatedProduct = { ...products[productIndex], ...obj };
            products[productIndex] = updatedProduct; 

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getAllProducts();
            const productIndex = products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                throw new Error("Product not found");
            }

            const deletedProduct = products.splice(productIndex, 1)[0]; 

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return deletedProduct; 
        } catch (error) {
            throw error;
        }
    }
}

export const Pmanager = new ProductsManager(path.join(process.cwd(), 'src', 'products.json'));