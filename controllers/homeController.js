// Big Promise for removing the try Catch
const BigPromise = require("../middlewares/bigPromise");

exports.home = BigPromise(async (req, res) => {
  res.render("home");
});
