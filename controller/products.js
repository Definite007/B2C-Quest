import express from "express";
import product from "../models/productModel.js";

const router = express.Router();

const paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {};
    try {
      const result = await model
        .find({ isDeleted: 0 })
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResults = result;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

router.get("/", paginatedResults(product), (req, res) => {
  let products = [];
  res.paginatedResults.map((productData) => {
    const productInfo = {
      product_id: productData._id,
      product_name: productData.name,
      product_sku: productData.sku,
      product_price: productData.price,
      product_mrp_price: productData.mrp_price,
      product_image: productData.image,
      product_brand_image: productData.brand_image,
    };
    products.push(productInfo);
  });
  let result = {
    msg: "data found",
    data: products,
  };

  res.status(201).json(result);
});

router.get("/search", async (req, res) => {
  var regex = new RegExp(req.query.name, "i");
  await product
    .find({ name: regex, isDeleted: 0 })
    .limit(10)
    .then((result) => {
      let products = [];
      result.map((productData) => {
        const productInfo = {
          product_id: productData._id,
          product_name: productData.name,
          product_sku: productData.sku,
          product_price: productData.price,
          product_mrp_price: productData.mrp_price,
          product_image: productData.image,
          product_brand_image: productData.brand_image,
        };
        products.push(productInfo);
      });

      res.status(201).json(products);
    });
});

router.post("/new", async (req, res) => {
  const dbData = req.body;
  dbData["isDeleted"] = 0;

  await product.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ message: data });
    }
  });
});

router.get("/delete", async (req, res) => {
  const dbData = req.query.name;
  await product.findOneAndUpdate(
    { name: dbData },
    { isDeleted: 1 },
    (err, data) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.status(201).send(data);
      }
    }
  );
});

export default router;
