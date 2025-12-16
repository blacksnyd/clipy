CREATE DATABASE clipy_db;

CREATE TABLE categories (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title varchar(100)
);

CREATE TABLE videos (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title varchar(150) NOT NULL,
   URL varchar(500) NOT NULL,
   cover varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
   duration int NOT NULL,
   description text NOT NULL,
   category_id int,
   FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE ratings (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   value int,
   video_id int,
   FOREIGN KEY (video_id) REFERENCES videos(id)
);

CREATE TABLE comments (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   content text,
   video_id int,
   FOREIGN KEY (video_id) REFERENCES videos(id)
);
