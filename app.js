const express = require("express");
require("dotenv").config({ path: "./config/.env" });

const app = express();

// Exporting app
module.exports = app;
