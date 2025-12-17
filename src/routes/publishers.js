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
    action: `/editeurs/${id}/update`,  // CHANGÉ ICI
    method: 'POST',  // CHANGÉ ICI (plus PUT)
    submitLabel: 'Enregistrer',
    editeur
  })
})

/**
 * Mise à jour - ROUTE POST SIMPLE (pas PUT)
 * POST /editeurs/:id/update
 */
router.post('/:id/update', async (req, res) => {
  const id = Number(req.params.id)
  const { nom } = req.body

  try {
    await prisma.editeur.update({
      where: { id },
      data: { nom }
    })

    res.redirect(`/editeurs/${id}?success=update`)
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    res.redirect(`/editeurs/${id}/edit?error=update`)
  }
})

/**
 * Suppression - ROUTE POST SIMPLE (pas DELETE)
 * POST /editeurs/:id/delete
 */
router.post('/:id/delete', async (req, res) => {
  const id = Number(req.params.id)

  try {
    // Vérifier si l'éditeur a des jeux associés
    const jeuxCount = await prisma.jeu.count({
      where: { editeurId: id }
    })

    // Si l'éditeur a des jeux, empêcher la suppression
    if (jeuxCount > 0) {
      return res.redirect(`/editeurs/${id}?error=hasGames&count=${jeuxCount}`)
    }

    // Si aucun jeu, procéder à la suppression
    await prisma.editeur.delete({ where: { id } })

    // Rediriger vers la liste avec un message de succès
    res.redirect('/editeurs?success=delete')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    
    // Gestion des erreurs
    if (error.code === 'P2003') {
      return res.redirect(`/editeurs/${id}?error=foreignKey`)
    }
    
    res.redirect(`/editeurs/${id}?error=unknown`)
  }
})

module.exports = router