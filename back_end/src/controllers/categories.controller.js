import db from '../config/db_pool.js';

export const all = async (req, res) => {
 try {
  const [rows] = await db.pool.execute(
    'SELECT * FROM categories'
  );
  res.status(200).json({
    success: true,
    data: rows
  });
} catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};
