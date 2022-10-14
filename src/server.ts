import { Server, Origins } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";
import { Game as TicTacToe } from "./tictactoe";
import { AmazonsGame as Amazons } from "./amazons";

const db = new PostgresStore(process.env.DATABASE_URL);

const PORT = Number(process.env.PORT) || 8000;
const server = Server({
  games: [TicTacToe, Amazons],
  origins: [/.*/, Origins.LOCALHOST], // TODO: remove wildcard after dev is done!
  db,
});
console.log(`port is ${PORT}`);
server.run(PORT);
