const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const hbs = require('hbs');
const { PrismaClient } = require('@prisma/client');
const seedGenres = require('./middlewares/seedGenres');

// ⚠️ Déclarations des routes UNE SEULE FOIS ici
const genreRoutes = require('./routes/genres');
const gameRoutes = require('./routes/games');

const publisherRoutes = require('./routes/publishers');

const app = express();
const prisma = new PrismaClient();

// --- Config Handlebars ---
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// helper pour comparer des valeurs dans les templates
hbs.registerHelper('eq', (a, b) => a === b);

// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Fallback manual override: certaines versions/configs peuvent ne pas
// détecter `_method` dans `req.body`. On s'assure ici que la méthode
// est remplacée si le champ est présent.
app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method.toUpperCase();
    delete req.body._method;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Debug logging for incoming requests (method, url, parsed body)
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl, 'body=', req.body);
  next();
});

// --- Routes ---

// Accueil (on mettra les jeux mis en avant plus tard)
app.get('/', (req, res) => {
  res.render('home', { title: 'Accueil' });
});

// Liste des genres
app.use('/genres', genreRoutes);

// Jeux
app.use('/games', gameRoutes);

app.use('/editeurs', publisherRoutes);
  
// --- Démarrage du serveur après seed des genres ---
async function start() {
  try {
    await seedGenres(prisma); // crée les genres s'ils n'existent pas
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur au démarrage de l'application :", err);
    process.exit(1);
  }
}

start();
