// import token jwt
import jwt from 'jsonwebtoken';
import env from '../config/db_config.js';
//connexion à la db
import db from '../config/db_pool.js';

export async function authenticate(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if(!auth || !auth.startsWith("Bearer ")){
            return res.status(401).json({
                error: "User not authenticated"
            })
        }

        const token = auth.slice(7);

        const payload = jwt.verify(token, env.JWT_SECRET);
        req.payload = payload;
        // console.log(payload);
        next();
        
    } catch (error) {
        error.status=401;
        next(error);
    }
}