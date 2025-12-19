import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = Object.values(err.flatten().fieldErrors).flat();
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
    next(err);
  }
};
