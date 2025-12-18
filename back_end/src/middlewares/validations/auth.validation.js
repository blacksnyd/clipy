import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username trop court"),
  email: z
    .string()
    .email("Email invalide"),
  password: z
    .string().min(6, "Mot de passe trop court (6 caractères min)")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
    ),
  confirm_password: z
    .string()
    .nonempty("La confirmation du mot de passe ne doit pas être vide"),
}).refine(
  (data) => data.password === data.confirm_password,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  }
);

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalide"),
  password: z
    .string()
    .min(6, "Mot de passe obligatoire"),
});