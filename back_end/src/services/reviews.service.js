import db from "../config/db_pool.js";

const createReview = async (rating, content, video_id, user_id) => {
   const [result] = await db.pool.execute(
    'INSERT INTO ratings (value, video_id, user_id) VALUES (?, ?, ?)',
    [rating, video_id, user_id]
   );
   return result.insertId;
}

const deleteReview = async (id) => {
   const [result] = await db.pool.execute(
    'DELETE FROM ratings WHERE id = ?',
    [id]
   );
   return result.affectedRows;
}

const findReviewsByVideo = async (video_id) => {
   const [rows] = await db.pool.execute(
      'SELECT * FROM ratings WHERE video_id = ? ORDER BY id DESC',
      [video_id]
   );
   return rows;
}

const findReviewById = async (id) => {
   const [rows] = await db.pool.execute(
      'SELECT * FROM ratings WHERE id = ?',
      [id]
   );
   return rows[0] || null;
}

export default { createReview, deleteReview, findReviewsByVideo, findReviewById };

