const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const hbs = require('hbs');
const { PrismaClient } = require('@prisma/client');
const seedGenres = require('./middlewares/seedGenres');

// Routes
const genreRoutes = require('./routes/genres');
const gameRoutes = require('./routes/games');
const publisherRoutes = require('./routes/publishers');

const app = express();
const prisma = new PrismaClient();

// --- Config Handlebars ---
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helper pour comparer des valeurs dans les templates
hbs.registerHelper('eq', (a, b) => a === b);

// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour query parameters - DOIT ÊTRE AVANT LES ROUTES
app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

// --- Routes ---
app.get('/', async (req, res) => {
  try {
    const gamesfeatured = await prisma.jeu.findMany({
      where: { misEnAvant: true }
    });
    const allgames = await prisma.jeu.findMany();
    const gen = await prisma.genre.findMany();

    res.render('home', {
      title: 'Accueil',
      allgames,
      gamesfeatured,
      gen
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Vérification que les routes sont bien des fonctions
if (typeof genreRoutes === 'function') {
  app.use('/genres', genreRoutes);
}

if (typeof gameRoutes === 'function') {
  app.use('/games', gameRoutes);
}

if (typeof publisherRoutes === 'function') {
  app.use('/editeurs', publisherRoutes);
  console.log('✅ Route /editeurs chargée');
} else {
  console.error('❌ publisherRoutes n\'est pas une fonction');
  app.use('/editeurs', (req, res) => {
    res.status(500).send('Erreur: Route éditeurs non chargée');
  });
}

// --- Démarrage du serveur ---
async function start() {
  try {
    await seedGenres(prisma);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur au démarrage :", err);
    process.exit(1);
  }
}

hbs.registerHelper('contains', (array, value) => {
  return array.some(item => item.genreId === value);
});

hbs.registerHelper('ifEquals', (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this);
});

start();