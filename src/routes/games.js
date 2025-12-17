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
  const { title, description, releaseDate, genreIds, editeurId, featured } = req.body;

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
        create: genreIds.map(id => ({
          genre: {
            connect: { id: Number(id) }
          }
        }))
      }
    }
  });


  res.redirect('/games');
});

/**
 * Détail d'un jeu : GET /games/:id
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const game = await prisma.jeu.findUnique({
    where: { id },
    include: {
      editeur: true,
      genres: {
        include: {
          genre: true
        }
      }
    }
  });

  if (!game) {
    return res.status(404).send('Jeu introuvable');
  }

  res.render('games/detail', {
    title: `Détail de ${game.titre}`,
    game
  });
});

/**
 * Suppression d'un jeu : DELETE /games/:id
 */
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    // Supprime d'abord toutes les relations avec les genres
    await prisma.jeuGenre.deleteMany({
      where: { jeuId: id }
    });

    // Supprime ensuite le jeu
    await prisma.jeu.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du jeu' });
  }
});

module.exports = router;
