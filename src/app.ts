// app.ts
import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/database";
import routes from "./routes/routes";

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.use("/", routes);

export default app;
