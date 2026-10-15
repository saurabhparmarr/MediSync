const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;