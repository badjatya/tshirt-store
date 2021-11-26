const app = require("./app");

const DatabaseConnect = require("./config/db");
DatabaseConnect();

app.listen(process.env.PORT, () =>
  console.log(`Listening at http://localhost:${process.env.PORT}`)
);
