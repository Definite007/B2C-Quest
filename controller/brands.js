import express from "express";
import brand from "../models/brandModel.js";

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

router.get("/", paginatedResults(brand), (req, res) => {
  let brands = [];
  res.paginatedResults.map((brandData) => {
    const brandInfo = {
      brand_id: brandData._id,
      brand_name: brandData.name,
      brand_image: brandData.image,
    };
    brands.push(brandInfo);
  });

  res.status(201).json(brands);
});

router.get("/search", async (req, res) => {
  var regex = new RegExp(req.query.name, "i");
  await brand
    .find({ name: regex, isDeleted: 0 })
    .limit(10)
    .then((result) => {
      let brands = [];
      result.map((brandData) => {
        const brandInfo = {
          brand_id: brandData._id,
          brand_name: brandData.name,
          brand_image: brandData.image,
        };
        brands.push(brandInfo);
      });

      res.status(201).json(brands);
    });
});

router.post("/new", async (req, res) => {
  const dbData = req.body;
  dbData["isDeleted"] = 0;

  await brand.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ message: data });
    }
  });
});

router.get("/delete", async (req, res) => {
  const dbData = req.query.name;
  await brand.findOneAndUpdate(
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
