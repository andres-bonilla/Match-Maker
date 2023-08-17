const express = require("express");
const cors = require("cors");
const volleyball = require("volleyball");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");

const app = express();
connectDB();

app.use(cors());
app.use(volleyball);
app.use(express.json());

app.use("/api", router);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
})

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.error(err.stack);
  res.send(err.message);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
