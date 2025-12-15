const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Liste de tous les genres
router.get('/', async (req, res) => {
  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' }
  });

  res.render('genres/index', {
    title: 'Genres',
    genres
  });
});

// Détail d'un genre + ses jeux
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const genre = await prisma.genre.findUnique({
    where: { id },
    include: {
      games: {
        orderBy: { title: 'asc' },
        include: { publisher: true }
      }
    }
  });

  if (!genre) {
    return res.status(404).send('Genre introuvable');
  }

  res.render('genres/detail', {
    title: genre.name,
    genre
  });
});

module.exports = router;
