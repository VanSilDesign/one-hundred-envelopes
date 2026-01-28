module.exports = () => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non autorizzato" });
    }
    next();
  };
};
