// import token jwt
import jwt from 'jsonwebtoken';
import env from '../config/db_config.js';
//connexion à la db
import db from '../config/db_pool.js';

export async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        const token = authorization.replace('Bearer ','');
        if(!token){
            return res.status(401).json({
                error: "pas de token"
            })
        }
        const payload = jwt.verify(token, env.JWT_SECRET);
        const [rows] = await db.pool.execute("SELECT id, email FROM users WHERE id =?", [payload.sub]);
        if(!rows[0]) {
            return res.status(401).json({error: 'user inexistant'});
        }
        
        req.user = rows[0];
        next();
        
    } catch (error) {
        error.status=401;
        next(error);
    }
}