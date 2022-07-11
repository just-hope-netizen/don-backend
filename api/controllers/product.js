import Product from '../models/product.js';
import cloudinary from '../utils/clodinary.js';


export const createProduct = async (req, res) => {

  const { image, price, category, title } = req.body;
  //upload image
  const uploadedImage = await cloudinary.v2.uploader.upload(image,
    { folder: 'don-remolo__products-image' },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      }

    });

  try {
    const newProduct = new Product({
      image: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      },
      title: title,
      price: price,
      categories: category
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }

};

export const updateProduct = async (req, res) => {
  const { image, price, category, title } = req.body;

  try {
    //delete former img from cloudinary
    const foundProduct = await Product.findById(req.params.id);
    const formerImage = foundProduct.image.public_id;
    cloudinary.v2.uploader.destroy(formerImage)

    //upload new image
    const uploadedImage = await cloudinary.v2.uploader.upload(image,
      { folder: 'don-remolo__products-image' },
      (error, result) => {
        if (error) {
          res.status(500).json(error);
        }

      });
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
          },
          title: title,
          price: price,
          categories: category
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
    //delete  img from cloudinary
    const foundProduct = await Product.findById(req.params.id);
    const formerImage = foundProduct.image.public_id;
    cloudinary.v2.uploader.destroy(formerImage)

    await Product.findByIdAndDelete(req.params.id);
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