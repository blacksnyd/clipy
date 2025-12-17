import { success } from "zod";
import db from "../config/db_pool.js";
import videosService from '../services/videos.service.js';
import {getVideoDurationInSeconds} from 'get-video-duration';

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

export const findVideoByTitle = async (req, res) => {

  try {

    const { title } = req.params;
    if (!title) {
      return res.status(400).json({
        success:false,
        message: "Titre invalide"
      })
    }

    const videos = await videosService.findByTitle(title);
    res.status(200).json({
      success: true,
      message: "Voici la liste des vidéos trouvées par titre",
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

export const findVideoByCategory = async (req, res) => {
  try {
    const category_id = Number(req.params.category_id)
    if (isNaN(category_id)) {
      return res.status(400).json({ success:false, message: "ID invalide"})
    }
    const videos = await videosService.findByCategory(category_id);
    res.status(200).json({
      success: true,
      message: "Voici la liste des vidéos trouvées par categorie",
      data: videos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des vidéos'
    });
  }
}

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
  //récupération de l'id (voir pour refacto avec delete et show)
  const id = Number(req.params.id);
  // console.log(id);

  // console.log("test update");
  try {
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
export const create = async (req, res) => {
  // On supprime le console.log(req.file) qui t'induisait en erreur

  try {
    const video_file = req.files?.video?.[0];
    const cover_file = req.files?.cover?.[0] ?? null;

    // Petite sécurité : si pas de vidéo, on arrête tout de suite
    if (!video_file) {
      return res.status(400).json({ success: false, message: "Fichier vidéo manquant" });
    }

    const video_url = `uploads/videos/${video_file.filename}`;
    const cover_url = cover_file ? `uploads/covers/${cover_file.filename}` : null;

    const duration = await getVideoDurationInSeconds(video_url);
    const duration_rounded = Math.ceil(duration);

    const video = await videosService.create(req.body, video_url, cover_url, duration_rounded);

    console.log("Succès vidéo créée :", video);

    return res.status(201).json({
      success: true,
      message: "Vidéo ajoutée avec succès",
      data: video
    });

  } catch (error) {
    console.error("ERREUR CREATE VIDEO :", error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la vidéo',
      error: error.message // Utile pour débugger côté front
    });
  }
}
