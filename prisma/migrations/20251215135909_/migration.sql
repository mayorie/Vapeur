/*
  Warnings:

  - You are about to drop the column `lien` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "genreId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,
    CONSTRAINT "Game_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("description", "featured", "genreId", "id", "publisherId", "releaseDate", "title") SELECT "description", "featured", "genreId", "id", "publisherId", "releaseDate", "title" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
