export const socketMiddleware = (req, res, next) => {
  req.fromSocket = req.body.fromSocket || false;
  next();
};