// Model
const Product = require("../models/product");

// Utils
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");

// Lib
const cloudinary = require("cloudinary");

exports.adminAddProduct = BigPromise(async (req, res, next) => {
  // checking the images are present or not
  if (!req.files) {
    return next(new CustomError("A product must have photos", 400));
  }

  // Checking all this fields are present
  const { name, price, description, category, stock, brand } = req.body;
  if (!(name || price || description || category || stock || brand)) {
    return next(
      new CustomError(
        "Product must have name, price, description, category, stock, brand",
        400
      )
    );
  }

  // Saving Photos
  let imageArray = [];
  // Uploading image based on single image or multiple image
  if (req.files.photos.length !== undefined) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "lco/t-shirtStore/products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secureUrl: result.secure_url,
      });
    }
  } else {
    let result = await cloudinary.v2.uploader.upload(
      req.files.photos.tempFilePath,
      {
        folder: "lco/t-shirtStore/products",
      }
    );

    imageArray.push({
      id: result.public_id,
      secureUrl: result.secure_url,
    });
  }

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    brand,
    photos: imageArray,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  let products = new WhereClause(Product.find(), req.query).search().filter();
  const totalProducts = await Product.countDocuments();
  const totalProductPerPage = 6;

  products.pager(totalProductPerPage);
  products = await products.base;

  res.status(200).json({
    status: "success",
    result: products.length,
    totalProducts,
    products,
  });
});

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.json({
    status: "success",
    product,
  });
});

exports.adminUpdateSingleProductDetails = BigPromise(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.json({
    status: "success",
    product,
  });
});

exports.adminDeleteSingleProductDetails = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Checking the product is available or not
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // Deleting the images of the product stored in cloudinary
  for (let index = 0; index < product.photos.length; index++) {
    await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  // Deleting the product from database
  await product.remove();

  res.json({
    status: "success",
    message: "Product removed successfully",
  });
});

exports.addProductReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  // Checking all the fields are there
  if (!rating || !comment || !productId) {
    return next(
      new CustomError(
        "A review must contain rating, comment and productId",
        400
      )
    );
  }

  // Checking product exist or not
  const product = await Product.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Checking the user has already given a review if true than updating the review else new review
  const isUserAlreadyGivenReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isUserAlreadyGivenReview) {
    product.reviews.map((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // Updating Average Rating
  let totalRating = 0;
  let totalNumberOfReviews = product.reviews.length;
  product.reviews.map((review) => {
    totalRating = totalRating + review.rating;
  });
  product.ratings = totalRating / totalNumberOfReviews;

  // Saving to DB
  await product.save();

  res.status(200).json({
    status: "success",
    message: "Review added successfully",
  });
});

exports.deleteProductReview = BigPromise(async (req, res, next) => {
  // Checking product exist or not
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // deleting review
  product.reviews = product.reviews.filter((review) => {
    return review.user.toString() !== req.user._id.toString();
  });

  // Updating numOfReviews
  product.numberOfReviews = product.reviews.length;

  // Updating Average Rating
  let totalRating = 0;
  let totalNumberOfReviews = product.reviews.length;
  product.reviews.forEach((review) => {
    totalRating = totalRating + review.rating;
  });
  product.ratings =
    totalRating === 0 ? 0 : Number(totalRating / totalNumberOfReviews);

  // Updating DB
  await product.save();

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});

exports.getAllProductReviews = BigPromise(async (req, res, next) => {
  // Checking product exist or not
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    reviews: product.reviews,
  });
});
