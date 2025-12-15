const DEFAULT_GENRES = [
  'Action',
  'Aventure',
  'RPG',
  'Simulation',
  'Sport',
  'MMORPG'
];

module.exports = async function seedGenres(prisma) {
  const count = await prisma.genre.count();

  // Si des genres existent déjà, on ne fait rien
  if (count > 0) {
    return;
  }

  // Sinon, on les crée
  await prisma.genre.createMany({
    data: DEFAULT_GENRES.map(name => ({ name }))
  });

  console.log('✅ Genres créés en base');
};
