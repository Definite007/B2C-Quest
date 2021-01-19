import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: String,
  sku: String,
  price: String,
  mrp_price: String,
  image: String,
  brand_image: String,
  isDeleted: Number,
});

export default mongoose.model("products", productSchema);
