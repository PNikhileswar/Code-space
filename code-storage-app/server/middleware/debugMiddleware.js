// Add this new file to debug authentication issues
exports.logRequest = (req, res, next) => {
  console.log("=== REQUEST DEBUG ===");
  console.log("Path:", req.path);
  console.log("Method:", req.method);
  console.log("Has Auth Header:", !!req.headers.authorization);
  console.log("Body Keys:", Object.keys(req.body));
  console.log("=== END DEBUG ===");
  next();
};