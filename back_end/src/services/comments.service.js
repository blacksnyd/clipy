import db from "../config/db_pool.js";

const createComment = async (content, video_id) => {
   const [result] = await db.pool.execute(
    'INSERT INTO comments (content, video_id) VALUES (?, ?)',
    [content, video_id]
   );
   return result.insertId;
}

const deleteComment = async (id) => {
   const [result] = await db.pool.execute(
    'DELETE FROM comments WHERE id = ?',
    [id]
   );gi
   return result.affectedRows;
}

const findCommentsByVideo = async (video_id) => {
   const [rows] = await db.pool.execute(
      'SELECT * FROM comments WHERE video_id = ?',
      [video_id]
   );
   return rows;
}

export default { createComment, deleteComment, findCommentsByVideo };