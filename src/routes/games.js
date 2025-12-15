const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Liste de tous les jeux : GET /games
 */
router.get('/', async (req, res) => {
  const games = await prisma.game.findMany({
    include: { genre: true, publisher: true },
    orderBy: { title: 'asc' }
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
  const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });
  const publishers = await prisma.publisher.findMany({ orderBy: { name: 'asc' } });

  res.render('games/form', {
    title: 'Nouveau jeu',
    genres,
    publishers,
    action: '/games',
    method: 'POST'
  });
});

/**
 * Création d'un jeu : POST /games
 */
router.post('/', async (req, res) => {
  const { title, description, releaseDate, genreId, publisherId, featured } = req.body;

  await prisma.game.create({
    data: {
      title,
      description,
      releaseDate: new Date(releaseDate),
      genreId: Number(genreId),
      publisherId: Number(publisherId),
      featured: featured === 'on'
    }
  });

  res.redirect('/games');
});

module.exports = router;
