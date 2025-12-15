CREATE DATABASE clipy_db;

USING clipy_db CREATE TABLE videos (
   id NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title varchar(150) NOT NULL,
   URL varchar(500) NOT NULL,
   duration int NOT NULL,
   description text NOT NULL,
   category_id FOREIGN KEY
);

USING clipy_db CREATE TABLE categories (
   id NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title varchar(100)
);

USING clipy_db CREATE TABLE ratings (
   id NOT NULL AUTO_INCREMENT PRIMARY KEY,
   value int,
   video_id FOREIGN KEY,
); 

USING clipy_db CREATE TABLE comments (
   id NOT NULL AUTO_INCREMENT PRIMARY KEY,
   content text,
   video_id FOREIGN KEY,
);