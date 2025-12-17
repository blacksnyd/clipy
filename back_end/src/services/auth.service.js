import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from "../config/db_pool.js";
import env from '../config/db_config.js';
import { Component } from 'react';


export async function register ({email, password}) {

    if (!email || !password) {
        const error = new Error("Email et mot de passe obligatoires");
        error.status= 400;
        throw error;
    }

    const hash = await bcrypt.hash(password, 10);
}