const mongoose = require("mongoose");

const DatabaseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DATABASE CONNECTED"))
    .catch((error) => {
      console.log("DATABASE NOT CONNECTED");
      console.log(error);
      process.exit(1);
    });
};

module.exports = DatabaseConnect;
