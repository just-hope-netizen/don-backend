import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  image: {
    public_id: {
      type: String,
      required: true
    },
     url: {
      type: String,
      required: true
    }
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  }


}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
