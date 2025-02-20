-- CreateTable
CREATE TABLE "baseball_players" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "games" INTEGER NOT NULL,
    "at_bat" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "double_2b" INTEGER NOT NULL,
    "third_baseman" INTEGER NOT NULL,
    "home_run" INTEGER NOT NULL,
    "run_batted_in" INTEGER NOT NULL,
    "a_walk" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "stolen_base" INTEGER NOT NULL,
    "caught_stealing" TEXT,
    "batting_average" REAL NOT NULL,
    "on_base_percentage" REAL NOT NULL,
    "slugging_percentage" REAL NOT NULL,
    "on_base_plus_slugging" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
