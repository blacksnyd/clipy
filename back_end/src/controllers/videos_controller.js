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

export const updateVideo = async (req,res) => {
  const id = Number(req.params.id);
  // console.log(id);
  
  // console.log("test update");
  try {
    //récupération de l'id (voir pour refacto avec delete et show)
    //condition si id n'est pas un nombre
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide"})
    }

     const updatedVideo = await videosService.update(id, req.body);

    //  console.log(updatedVideo);
    
  //affichage de la response
  return res.status(200).json({
    success: true,
    message: "Vidéo mise à jour",
    data: updatedVideo
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
    const deletedVideo = await videosService.destroy(id);
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
export const create = async (req,res) => {
  try {

  } catch (error) {

  }
}
