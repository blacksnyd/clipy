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

export default {findAll, findById}
