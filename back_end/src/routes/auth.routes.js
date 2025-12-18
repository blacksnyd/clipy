import { Router } from "express";
import { registerController,loginController, profileController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

//route de sign-up
router.post('/register', registerController);
//route de sign-in
router.post('/login', loginController);
router.get('/profile', authenticate, profileController);

export default router;