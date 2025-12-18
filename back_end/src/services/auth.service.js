import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from "../config/db_pool.js";
import env from '../config/db_config.js';


export async function register ({username, email, password}) {

    if (!username || !email || !password) {
        const error = new Error("Email et mot de passe obligatoires");
        error.status= 400;
        throw error;
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.pool.execute(
        `INSERT INTO users (username, email, password_hash) VALUES(?,?,?)`,
        [username, email, hash]
    )
    return {
        id: result.insertId,
        username,
        email
    }
};

export async function login ({email, password}) {
    
    const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE email = ?', [email]);
    
    const user = rows[0];

    if (!user) {
        const error = new Error("Identifiants invalides");
        error.status = 401;
        throw error;
    }

    const compare_passwords = await bcrypt.compare(password, user.password_hash);

    if (!compare_passwords) {
        const error = new Error("Identifiants invalides");
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email, username: user.username },
        env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return {
        token,
        user: { id: user.id, email: user.email, username: user.username},
    };
}

export async function getProfile (id) {
    const [rows] = await db.pool.execute(
        "SELECT username, email FROM users WHERE id = ?",
        [id]
    );

    const user = rows[0];

    if(!user){
        const error = new Error("Nonexistent user");
        error.status = 401;
        throw error;
    }

    return user;

}