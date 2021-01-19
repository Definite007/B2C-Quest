import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import allBrands from "./controller/brands.js";
import allProducts from "./controller/products.js";

// app config
const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(cors());

// DB config
const mongoURI =
  "mongodb+srv://admin:HVKRGjoOa3DwFsaz@cluster0.mdubn.mongodb.net/b2cDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");
});

// api Routes
app.get("/", (req, res) => res.status(200).send("Hello World"));
app.use("/brands", allBrands);
app.use("/products", allProducts);

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
