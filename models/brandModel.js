import mongoose from "mongoose";

const brandSchema = mongoose.Schema({
  id: String,
  name: String,
  image: String,
  isDeleted: Number,
});

export default mongoose.model("brands", brandSchema);
