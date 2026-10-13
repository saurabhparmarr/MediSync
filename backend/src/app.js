const express = require("express");
const { notFound, errorHandler, asyncHandler } = require("./middlewares/error.middleware");
const ApiError = require("./utils/ApiError");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use(notFound);
app.use(errorHandler);

module.exports = app;