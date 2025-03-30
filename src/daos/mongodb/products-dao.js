import { ProductModel } from "./models/product-model.js";
import MongoDao from "./mongo-dao.js";

class ProductsDao extends MongoDao {
  constructor() {
    super(ProductModel);
  }

  getAllProducts = async ({ limit = 10, page = 1, query, sort }) => {
    try {
      const options = {
        limit: Number(limit),
        page: Number(page),
        sort: sort ? { price: sort === 'desc' ? -1 : 1 } : undefined,
        lean: true
      };

      const filter = query ? { 
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      } : {};

      return await this.model.paginate(filter, options);
    } catch (error) {
      throw new Error(`DAO error: ${error.message}`);
    }
  }
}

export const productDao = new ProductsDao();