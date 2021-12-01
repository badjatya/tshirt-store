const express = require("express");
require("dotenv").config({ path: "./config/.env" });

const app = express();

// Library
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

// Swagger API Documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(morgan("tiny"));

// ** Routes
app.use("/", require("./routes/home"));
app.use("/api/v1/users", require("./routes/user"));
app.use("/api/v1/admin", require("./routes/admin"));
app.use("/api/v1/product", require("./routes/product"));
app.use("/api/v1/order", require("./routes/order"));

// Exporting app
module.exports = app;
