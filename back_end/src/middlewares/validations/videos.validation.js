import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(50, "Le titre doit contenir au maximum 50 caractères")
  .nonempty("Le titre ne peut pas être vide"),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères").max(500, "La description doit contenir au maximum 500 caractères")
  .nonempty("La description ne peut pas être vide"),
  category_id: z.coerce.number().min(1, "Vous devez sélectionner une catégorie")
});
