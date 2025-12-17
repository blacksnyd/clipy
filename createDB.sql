CREATE DATABASE clipy_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(100) NOT NULL UNIQUE,
  email varchar(150) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);
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
   category_id int NOT NULL,
   user_id INT NOT NULL,
   FOREIGN KEY (category_id) REFERENCES categories(id),
   FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ratings (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   value int,
   video_id int,
   user_id INT NOT NULL,
   FOREIGN KEY (video_id) REFERENCES videos(id),
   FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   content text,
   video_id int,
   user_id INT NOT NULL,
   FOREIGN KEY (video_id) REFERENCES videos(id),
   FOREIGN KEY (user_id) REFERENCES users(id)
);