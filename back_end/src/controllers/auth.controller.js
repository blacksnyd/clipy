import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db_pool';



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
}