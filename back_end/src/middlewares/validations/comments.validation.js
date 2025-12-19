import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(3, "Le commentaire doit contenir au moins 3 caractères").max(150, "Le commentaire doit contenir au maximum 150 caractères")
  .nonempty("Le commentaire ne peut pas être vide")
});
