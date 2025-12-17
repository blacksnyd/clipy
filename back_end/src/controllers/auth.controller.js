import db from '../config/db_pool.js';
import { register, login } from '../services/auth.service.js';
import { success } from 'zod';


export async function registerController(req, res, next) {
    try {
            //appel au auth.service.register
            const user = await register(req.body)
            //la response
            res.status(201).json({
                success: true,
                message:"user créé",
                data: user
            })
        } catch (error) {
            console.error('erreur lors de la creation du compte', error);
            next(error);
        }
};

export async function loginController (req, res, next) {
    
    try {
        const {username, email ,password} = req.body;

        const user = await login(req.body)

        res.status(200).json({
            success: true,
            message: `Vous êtes maintenant connecté, Bienvenue ${username}`,
            data: user
        })
    } catch (error) {
        console.error('erreur lors de la récupération du compte', error);
        next(error);
    }
}