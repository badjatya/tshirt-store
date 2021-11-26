// Big Promise for removing the try Catch
const BigPromise = require("../middlewares/bigPromise");

exports.home = BigPromise(async (req, res) => {
  res.json({
    status: "success",
    greeting: "Hello from T-Shirt Store API",
  });
});

exports.dummy = (req, res) => {
  res.json({
    status: "success",
    greeting: "Hello from T-Shirt Store API DUMMY Route",
    dummy: true,
  });
};
