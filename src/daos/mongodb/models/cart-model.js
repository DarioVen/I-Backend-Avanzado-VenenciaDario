import { Schema, model, Types } from 'mongoose';

const cartSchema = new Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true,
    default: () => new Types.ObjectId().toString() 
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
}, { timestamps: true });

cartSchema.pre('find', function() {
  this.populate('products.product');
});

export const CartModel = model('Cart', cartSchema);