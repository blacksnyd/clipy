import { Router } from "express";

import { validate } from "../middlewares/validations/validate.js";
import { registerSchema, loginSchema } from "../middlewares/validations/auth.validation.js";
import { registerController,loginController, profileController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router();

//route de sign-up
router.post('/register',validate(registerSchema), registerController);
//route de sign-in
router.post('/login',validate(loginSchema), loginController);
router.get('/profile', authenticate, profileController);


export default router;
