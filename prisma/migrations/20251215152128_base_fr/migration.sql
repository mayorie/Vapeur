/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `Editeur` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Genre` table. All the data in the column will be lost.
  - Added the required column `nom` to the `Editeur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Game";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameGenre";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Jeu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateSortie" DATETIME NOT NULL,
    "misEnAvant" BOOLEAN NOT NULL DEFAULT false,
    "lien" TEXT,
    "editeurId" INTEGER NOT NULL,
    CONSTRAINT "Jeu_editeurId_fkey" FOREIGN KEY ("editeurId") REFERENCES "Editeur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JeuGenre" (
    "jeuId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("jeuId", "genreId"),
    CONSTRAINT "JeuGenre_jeuId_fkey" FOREIGN KEY ("jeuId") REFERENCES "Jeu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JeuGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Editeur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);
INSERT INTO "new_Editeur" ("id") SELECT "id" FROM "Editeur";
DROP TABLE "Editeur";
ALTER TABLE "new_Editeur" RENAME TO "Editeur";
CREATE UNIQUE INDEX "Editeur_nom_key" ON "Editeur"("nom");
CREATE TABLE "new_Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);
INSERT INTO "new_Genre" ("id") SELECT "id" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
CREATE UNIQUE INDEX "Genre_nom_key" ON "Genre"("nom");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
