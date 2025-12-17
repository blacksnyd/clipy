import { Router } from "express";
import { registerController,loginController } from "../controllers/auth.controller.js";

const router = Router();

//route de sign-up
router.post('/register', registerController);
//route de sign-in
router.post('/login', loginController);

export default router;