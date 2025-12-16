import db from '../config/db_pool.js';

const findAll = async () => {
  const [rows] = await db.pool.execute('SELECT * FROM videos');
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.pool.execute(
    'SELECT * FROM videos WHERE id = ?',
    [id]
  );
  return rows[0];
};

const update = async (id, videoData) => {
  const { title, URL, duration, description, category_id } = videoData;

  const [result] = await db.pool.execute(
    `UPDATE videos
     SET title = ?, URL = ?, duration = ?, description = ?, category_id = ?
     WHERE id = ?`,
    [title, URL, duration, description, category_id, id]
  );
  console.log(result);
  

  return result;
};

const destroy =  async (id) => {
  //execute la requete préparée sql delete
      const [rows] = await db.pool.execute(
        "DELETE FROM videos WHERE id=?",
        [id]
      );
}



export default {findAll, findById, update, destroy}
