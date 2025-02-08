export const productValidator = (req, res, next) => {
  const { title, description, code, price, stock, category, thumbnails, status } = req.body;

  if (
    title === undefined || typeof title !== "string" ||
    description === undefined || typeof description !== "string" ||
    code === undefined || typeof code !== "string" ||
    price === undefined || typeof price !== "number" ||
    stock === undefined || typeof stock !== "number" ||
    category === undefined || typeof category !== "string"
  ) {
    return res.status(400).json({ message: "Invalid body" });
  }

  if (thumbnails !== undefined) {
    if (!Array.isArray(thumbnails) || thumbnails.some(thumb => typeof thumb !== 'string')) {
      return res.status(400).json({ message: "Thumbnails debe ser un array de strings si se proporciona." });
    }
  }

  if (status !== undefined && typeof status !== "boolean") {
    return res.status(400).json({ message: "Status debe ser booleano si se proporciona." });
  }

  return next();
};