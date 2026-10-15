const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.slice(1).join("."),
      message: issue.message,
    }));
    return next(new ApiError(400, "Validation failed", details));
  }

  req.body = result.data.body ?? req.body;
  next();
};

module.exports = validate;