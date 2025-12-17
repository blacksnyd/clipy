import dotenv from 'dotenv';
dotenv.config();

const required = [
   "DB_HOST",
   "DB_PORT",
   "DB_NAME",
   "DB_USER",
   // "DB_PASSWORD",
   "PORT",
   "JWT_SECRET"
]

for (const key of required){
   if(!process.env[key] || process.env[key] === undefined){
      throw new Error (`Error: missing env variable ${key}`);
   }
}

export default {
   PORT : process.env.PORT,
   DB_HOST : process.env.DB_HOST,
   DB_NAME : process.env.DB_NAME,
   DB_USER : process.env.DB_USER,
   DB_PASSWORD : process.env.DB_PASSWORD,
   DB_PORT : process.env.DB_PORT,
   JWT_SECRET: process.env.JWT_SECRET
}
