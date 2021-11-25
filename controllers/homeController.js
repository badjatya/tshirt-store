exports.home = (req, res) => {
  res.json({
    status: "success",
    greeting: "Hello from T-Shirt Store API",
  });
};

exports.dummy = (req, res) => {
  res.json({
    status: "success",
    greeting: "Hello from T-Shirt Store API DUMMY Route",
    dummy: true,
  });
};
