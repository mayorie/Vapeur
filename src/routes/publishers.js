const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Liste de tous les éditeurs
 * GET /publishers
 */
router.get('/', async (req, res) => {
  const publishers = await prisma.publisher.findMany({
    orderBy: { name: 'asc' }
  });

  res.render('publishers/index', {
    title: 'Éditeurs',
    publishers
  });
});

/**
 * Formulaire de création d'un éditeur
 * GET /publishers/new
 */
router.get('/new', (req, res) => {
  res.render('publishers/form', {
    title: 'Nouvel éditeur',
    action: '/publishers',
    method: 'POST'
  });
});

/**
 * Création d'un éditeur
 * POST /publishers
 */
router.post('/', async (req, res) => {
  const { name } = req.body;

  await prisma.publisher.create({
    data: { name }
  });

  res.redirect('/publishers');
});

/**
 * Détail d'un éditeur + ses jeux (même si pour l'instant il y en a 0)
 * GET /publishers/:id
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const publisher = await prisma.publisher.findUnique({
    where: { id },
    include: {
      games: {
        orderBy: { title: 'asc' },
        include: { genre: true }
      }
    }
  });

  if (!publisher) {
    return res.status(404).send('Éditeur introuvable');
  }

  res.render('publishers/detail', {
    title: publisher.name,
    publisher
  });
});

module.exports = router;
