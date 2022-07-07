import express from 'express';
import multer from 'multer';

import {
  verifyTokenAndAdmin,
} from './verifyToken.js';
import { createProduct, updateProduct, deleteProduct, getProducts, getProduct } from '../controllers/product.js';

const router = express.Router();

//config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new Error('file type not allowed'), false)
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

//create
router.post('/', verifyTokenAndAdmin, upload.single('image'), createProduct);

//update
router.put('/:id', verifyTokenAndAdmin, upload.single('image'), updateProduct);

//delete
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

//get product
router.get('/find/:id', getProduct);

//get  products
router.get('/', getProducts);

export default router;
