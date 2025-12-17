import db from '../config/db_pool.js';
import categoriesService from "../services/categories.service.js";


export const all = async (req, res) => {
 try {
  const categories = await categoriesService.findAll();
  res.status(200).json({
    success: true,
    data: categories
  });
} catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};
