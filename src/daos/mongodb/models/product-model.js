import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  code: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, required: true },
  thumbnails: { type: Array}
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model('Product', productSchema);

