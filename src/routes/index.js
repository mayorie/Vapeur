const express = require('express');
const router = express.Router();
const { Game } = require('../models');

router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll();

    console.log('GAMES ENVOYÉS AU HOME :', games.length);

    res.render('home', {
      games: games
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
