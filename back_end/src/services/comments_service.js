import db from "../config/db_config";

const createComment = async () => {
   const [rows] = await db.pool.execute(
    'INSERT INTO comments (content, video_id) VALUES (?, ?)',
    [content, video_id]
   );
   return rows[0];
}

const deleteComment = async (id) => {
   const [rows] = await db.pool.execute(
    'DELETE FROM comments WHERE id = ?',
    [id]
   );
   return rows[0];
}

const findCommentsByVideo = async (video_id) => {
   const [rows] = await db.pool.execute(
      'SELECT * FROM comments WHERE video_id = ?',
      [video_id]
   );
   return rows;
}