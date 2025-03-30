import { productService } from "../services/product-services.js";

class ProductController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        
        const result = await this.service.getAll({ 
            limit, 
            page, 
            query, 
            sort 
        });

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage || null,
            nextPage: result.nextPage || null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage 
                ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
                : null,
            nextLink: result.hasNextPage 
                ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
                : null
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.service.getById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const newProd = await this.service.create(req.body);
      res.json(newProd);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const productUpd = await this.service.update(id, req.body);
      res.status(200).json(productUpd);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const productDel = await this.service.delete(id);
      res.status(200).json(productDel);
    } catch (error) {
      next(error);
    }
  };
}

export const productController = new ProductController(productService);