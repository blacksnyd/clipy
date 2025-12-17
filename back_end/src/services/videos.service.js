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

const findByTitle = async (title) => {

  const [rows] = await db.pool.execute(
    "SELECT * FROM videos WHERE title LIKE ? ORDER BY title ASC",
    [`%${title}%`]
  );
  return rows;

};

const findByCategory = async (category_id) => {

  const [rows] = await db.pool.execute(
    "SELECT * FROM videos WHERE category_id = ?",
    [category_id]
  );
  return rows;
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

const create = async (data, video_url, cover_url, duration_rounded) => {
  const [result] = await db.pool.execute(
    "INSERT INTO videos (title, URL, cover, duration, description, category_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.title,
      video_url,
      cover_url ?? null,
      duration_rounded,
      data.description,
      data.category_id ?? null
    ]
  );

  return {
    id: result.insertId,
    title: data.title,
    URL: video_url,
    cover: cover_url,
    duration: duration_rounded,
    description: data.description,
    category_id: data.category_id
  };
};

export default {findAll, findById, update, destroy, create, findByTitle, findByCategory}
