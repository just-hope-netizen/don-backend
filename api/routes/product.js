import express from 'express';
import {
  verifyTokenAndAdmin,
} from './verifyToken.js';
import { createProduct, updateProduct, deleteProduct, getProducts, getProduct } from '../controllers/product.js';

const router = express.Router();


//create
router.post('/', verifyTokenAndAdmin, createProduct);

//update
router.put('/:id', verifyTokenAndAdmin,  updateProduct);

//delete
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

//get product
router.get('/find/:id', getProduct);

//get  products
router.get('/', getProducts);

export default router;
