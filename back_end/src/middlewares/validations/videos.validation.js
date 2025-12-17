import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères")
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err.flatten().fieldErrors
    });
  }
};
