import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  url: z.string().url("L'URL de la vidéo est invalide"),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Validation échouée"
      errors: err.errors,
    });
  }
};
