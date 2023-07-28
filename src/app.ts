import { connectDB } from "./config/database";
const express = require("express");

import routes from "./routes/routes";

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use("/", routes);

export default app;
