const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const hbs = require('hbs');
const { PrismaClient } = require('@prisma/client');
const seedGenres = require('./middlewares/seedGenres');

// Routes - vérifie que ces fichiers existent
const genreRoutes = require('./routes/genres');
const gameRoutes = require('./routes/games');
const publisherRoutes = require('./routes/publishers'); // Vérifie ce fichier!

const app = express();
const prisma = new PrismaClient();

// --- Config Handlebars ---
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helper pour comparer des valeurs
hbs.registerHelper('eq', (a, b) => a === b);

// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Fallback manual override
app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method.toUpperCase();
    delete req.body._method;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour query parameters - AJOUTÉ ICI
app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

// Debug logging
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl, 'body=', req.body);
  next();
});

// --- Routes ---
app.get('/', (req, res) => {
  res.render('home', { title: 'Accueil' });
});

// TEST: D'abord une route simple pour vérifier
app.get('/test-editeurs', (req, res) => {
  res.send('Test éditeurs OK');
});

// Utilise les routes seulement si elles existent
if (publisherRoutes && typeof publisherRoutes === 'function') {
  app.use('/editeurs', publisherRoutes);
  console.log('✅ Route /editeurs chargée');
} else {
  console.error('❌ publisherRoutes n\'est pas une fonction. Vérifie le fichier routes/publishers.js');
  // Route de secours
  app.use('/editeurs', (req, res) => {
    res.status(500).send('Erreur: Route éditeurs non chargée');
  });
}

// Les autres routes
if (genreRoutes && typeof genreRoutes === 'function') {
  app.use('/genres', genreRoutes);
}
if (gameRoutes && typeof gameRoutes === 'function') {
  app.use('/games', gameRoutes);
}

// --- Démarrage du serveur ---
async function start() {
  try {
    await seedGenres(prisma);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📁 Test: http://localhost:${PORT}/test-editeurs`);
    });
  } catch (err) {
    console.error("Erreur au démarrage :", err);
    process.exit(1);
  }
}

start();