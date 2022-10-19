import { Server, Origins } from "boardgame.io/server";
import { PersistSQLStore } from "bgio-sql";
import { AmazonsGame as Amazons } from "./amazons";

const db = new PersistSQLStore(process.env.DATABASE_URL);

const PORT = Number(process.env.PORT) || 8000;
const server = Server({
  games: [Amazons],
  origins: [/.*/, Origins.LOCALHOST], // TODO: remove wildcard after dev is done!
  db,
});
console.log(`port is ${PORT}`);
server.run(PORT);
