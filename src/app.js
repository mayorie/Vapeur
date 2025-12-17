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
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---

// Accueil (on mettra les jeux mis en avant plus tard)
app.get('/', async (req, res) => {
  try {
    const gamesfeatured = await prisma.jeu.findMany({
      where: {
        misEnAvant: true   // ou misEnAvant: true selon ton schema
      }
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

// Liste des genres
app.use('/genres', genreRoutes);

// Jeux
app.use('/games', gameRoutes);

app.use('/publishers', publisherRoutes);

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
