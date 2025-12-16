const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

/**
 * Liste de tous les éditeurs
 * GET /editeurs
 */
router.get('/', async (req, res) => {
  const editeurs = await prisma.editeur.findMany({
    orderBy: { nom: 'asc' }
  })

  res.render('publishers/index', {
    title: 'Éditeurs',
    editeurs
  })
})

/**
 * Formulaire de création
 * GET /editeurs/new
 */
router.get('/new', (req, res) => {
  res.render('publishers/form', {
    title: 'Nouvel éditeur',
    action: '/editeurs',
    method: 'POST',
    submitLabel: 'Créer'
  })
})

/**
 * Création
 * POST /editeurs
 */
router.post('/', async (req, res) => {
  const { nom } = req.body

  await prisma.editeur.create({
    data: { nom }
  })

  res.redirect('/editeurs')
})

/**
 * Détail d'un éditeur + ses jeux
 * GET /editeurs/:id
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)

  const editeur = await prisma.editeur.findUnique({
    where: { id },
    include: {
      jeux: {
        orderBy: { titre: 'asc' },
        include: {
          genres: {
            include: {
              genre: true
            }
          }
        }
      }
    }
  })

  if (!editeur) {
    return res.status(404).send('Éditeur introuvable')
  }

  res.render('publishers/detail', {
    title: editeur.nom,
    editeur
  })
})

/**
 * Formulaire d'édition
 * GET /editeurs/:id/edit
 */
router.get('/:id/edit', async (req, res) => {
  const id = Number(req.params.id)

  const editeur = await prisma.editeur.findUnique({ where: { id } })

  if (!editeur) {
    return res.status(404).send('Éditeur introuvable')
  }

  res.render('publishers/form', {
    title: 'Modifier un éditeur',
    action: `/editeurs/${id}`,
    method: 'PUT',
    submitLabel: 'Enregistrer',
    editeur
  })
})

/**
 * Mise à jour
 * PUT /editeurs/:id
 */
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { nom } = req.body

  await prisma.editeur.update({
    where: { id },
    data: { nom }
  })

  res.redirect(`/editeurs/${id}`)
})

/**
 * Suppression
 * DELETE /editeurs/:id
 */
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)

  await prisma.editeur.delete({ where: { id } })

  res.redirect('/editeurs')
})

module.exports = router
