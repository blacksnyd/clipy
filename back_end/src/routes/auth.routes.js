import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../middlewares/validations/auth.validation.js";
import { registerController,loginController } from "../controllers/auth.controller.js";

const router = Router();

//route de sign-up
router.post('/register',validate(registerSchema), registerController);
//route de sign-in
router.post('/login',validate(loginSchema), loginController);

export default router;