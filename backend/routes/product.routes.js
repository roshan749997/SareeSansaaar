import express from 'express';
import { getAllProducts, productByCategory } from '../controllers/product.controller.js';

const productRouter = express.Router();

// GET /api/products - Get all products or filter by category
// productRouter.get('/', getProducts);

// GET /api/products/:id - Get a single product by ID
// productRouter.get('/:id', getProductById);


productRouter.get('/products',getAllProducts);
productRouter.get('/product',productByCategory);

export default productRouter;
