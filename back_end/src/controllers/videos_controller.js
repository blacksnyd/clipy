import db from "../config/db_pool.js";
import videosService from '../services/videos_service.js';

export const all = async (req, res) => {
  try {
    const videos = await videosService.findAll();
    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des vidéos'
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  try {
    const video = await videosService.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la vidéo'
    });
  }
};
import { success } from "zod";

}
export const updateVideo = async (req,res) => {
  // console.log("test update");
  try {
    //récupération de l'id (voir pour refacto avec delete et show)
    const id = Number(req.params.id);
    //condition si id n'est pas un nombre
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide"})
    }
    //on récupère les infos contenu dans le body de la requete
    const { title, URL, duration, description, category_id } = req.body;
    //on récupère un tableau result qui va encapsuler le résultat de requete PUT
    const [result] = await db.pool.execute(
      `UPDATE videos
      SET title = ?, URL= ?, duration= ?, description= ?, category_id = ?
      WHERE id = ?`,
    [title, URL, duration, description, category_id, id]
  );
  //affichage de la response
  return res.status(200).json({ 
    success: true,
    message: "Vidéo mise à jour",
  });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
    
  }
};
export const deleteVideo = async (req, res) => {
  try {

    // récupération de l'id
    const id = Number(req.params.id);
    //condition si id n'est pas un nombre
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide"})
    }
    //execute la requete préparée sql delete
    const [result] = await db.pool.execute(
      "DELETE FROM videos WHERE id=?",
      [id]
    );
    //renvoie une response avec le message
    return res.status(204).json({
      success: true, 
      message:"Vidéo bien supprimée",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur"})
  }
}
  
