## commandes : 

### commandes d'initialisation : 

npm install : pour installer tout les modules.

il faut créer le .env avec l'endroit de la database : DATABASE_URL="file:./dev.db"
npx prisma migrate dev : pour création de base de données

npm run start : pour lancer le site

### commandes intéressantes : 

npx prisma studio : prisma studio

## problèmes :

### conflits : 

Modification de la table, donc les HBS ne marchaient plus pour les genre.

## actions du prof : 

Aller dans le dossier du projet cloné
cd Vapeur

Installer toutes les dépendances du projet
npm install

Initialiser la base de données Prisma (création du fichier SQLite + migrations)
npx prisma migrate dev --name init

Générer le client Prisma (si non déjà fait)
npx prisma generate

Lancer l'application en local
npm start
?

----------------------------------------------------------------------------------------------------------------------
partage du travail :

#page d'accueil : 

2-Afficher la liste de tous les jeux sur une page dédiée

1-Afficher la liste des jeux mis en avant sur la page d'accueil

7-Possibilité d'afficher le jeux sur la page d'accueil (mise en avant)

#un jeu : 

4-Afficher le détail d'un jeu (avec ses infos, son genre et son éditeur)

3-Création d'un jeu

5-Modification d'un jeu (nom, description, date de sortie, genre, éditeur)

6-Suppression d'un jeu

#création de la base de donnée et les différents affichages : 

2-Afficher la liste de tous les jeux sur une page dédiée

8-Afficher la liste des genres sur une page dédiée

9-Afficher la liste des jeux d'un genre sur une page dédiée

#éditeur : 

11-Afficher la liste des éditeurs sur une page dédiée

10-Création d'un éditeur

13-Modification d'un éditeur

14-Suppression d'un éditeur

12-Afficher la liste des jeux d'un éditeur sur une page dédiée

---------------------------------------------------------------------------------------------------------------
bd: 
jeu |id |titre| desc| date |mise en avant| idgenre| id editeur| 
editeur| id |nom| 
genre |id |nom|