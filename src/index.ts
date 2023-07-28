import app from "./app";
const config = require("./config/config");

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
