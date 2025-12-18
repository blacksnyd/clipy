import db from '../config/db_pool.js';
import { register, login, getProfile } from '../services/auth.service.js';
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

export async function profileController (req, res, next) {
    try {
        const payload = req.payload;
        // console.log(payload);
        const userID = payload.sub;

        const user = await getProfile(userID);
        console.log(user);
        
        return res.status(200).json({
            success: true,
            message: 'Profile retreived',
            data: user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error getting user profile'
        })
    }
}