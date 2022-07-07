import Product from '../models/product.js';

import fs from 'fs';


export const createProduct = async (req, res) => {
  const newProduct = new Product({
    image: {
      data: fs.readFileSync('uploads/' + req.file.filename),
      contentType: req.file.mimetype,
      path: req.file.path

    },
    title: req.body.title,
    price: req.body.price,
    categories: req.body.categories
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }

};

export const updateProduct = async (req, res) => {

  // delete the former image from uploads folder 
  const product = await Product.findById(req.params.id)
  fs.unlink(product.image.path, (err) => { if (err) throw err })

  try {
    //set new image
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            data: fs.readFileSync('uploads/' + req.file.filename),
            contentType: req.file.mimetype,
            path: req.file.path

          },
          title: req.body.title,
          price: req.body.price,
          categories: req.body.categories

        }
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  };
}


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    await Product.findByIdAndDelete(req.params.id);
    // delete image from uploads folder
    fs.unlink(product.image.path, (err) => {
      if (err) throw err
    })
    res.status(200).json('Product has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
}

export const getProduct = async (req, res) => {
  try {
    let product = []
    const Foundproduct = await Product.findById(req.params.id);
    product.push(Foundproduct)
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
}

export const getProducts = async (req, res) => {
  const queryProduct = req.query.product;
  const queryCategory = req.query.category;

  try {
    let products;
    if (queryProduct) {
      products = await Product.find({ title: { $regex: queryProduct } })
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find()
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
}