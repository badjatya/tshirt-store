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
app.use(fileUpload());
app.use(morgan("tiny"));

// ** Routes
app.use("/api/v1", require("./routes/home"));
app.use("/api/v1/users", require("./routes/user"));

// Exporting app
module.exports = app;
