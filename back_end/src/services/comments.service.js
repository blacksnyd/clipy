import db from "../config/db_pool.js";

const createComment = async (content, video_id, user_id) => {
   const [result] = await db.pool.execute(
    'INSERT INTO comments (content, video_id, user_id) VALUES (?, ?, ?)',
    [content, video_id, user_id]
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
      `SELECT 
         c.id,
         c.content,
         c.video_id,
         c.user_id,
         u.username
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.video_id = ?
       ORDER BY c.id DESC`,
      [video_id]
   );
   return rows;
}

export default { createComment, deleteComment, findCommentsByVideo };