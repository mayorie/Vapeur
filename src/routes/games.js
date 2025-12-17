const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Liste de tous les jeux : GET /games
 */
router.get('/', async (req, res) => {
  const games = await prisma.jeu.findMany({
    include: {
      editeur: true,
      genres: {
        include: {
          genre: true
        }
      }
    },
    orderBy: { titre: 'asc' }
  });

  res.render('games/index', {
    title: 'Tous les jeux',
    games
  });
});


/**
 * Formulaire de création d'un jeu : GET /games/new
 */
router.get('/new', async (req, res) => {
  const genres = await prisma.genre.findMany({
    orderBy: { nom: 'asc' }
  });

  const editeurs = await prisma.editeur.findMany({
    orderBy: { nom: 'asc' }
  });

  res.render('games/form', {
    title: 'Nouveau jeu',
    genres,
    editeurs,
    action: '/games'
  });
});


/**
 * Création d'un jeu : POST /games
 */
router.post('/', async (req, res) => {
  const { title, description, releaseDate, genreId, editeurId, featured } = req.body;

  await prisma.jeu.create({
    data: {
      titre: title,
      description,
      dateSortie: new Date(releaseDate),
      misEnAvant: featured === 'on',
      editeur: {
        connect: { id: Number(editeurId) }
      },
      genres: {
        create: {
          genre: {
            connect: { id: Number(genreId) }
          }
        }
      }
    }
  });

  res.redirect('/games');
});


module.exports = router;
