export const serviceAuth = async (req, res, next) => {
  const user = req.headers["x-user"];

  if (user) {
    req.user = JSON.parse(user);
    return next();
  }

  return res.status(401).json({ success: false, message: "Unauthorized" });
};
