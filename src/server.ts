/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Server, Origins } from "boardgame.io/server";
import { Game as TicTacToe } from "./tictactoe";

const PORT = Number(process.env.PORT) || 8000;
const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
});
console.log(`port is ${PORT}`);
server.run(PORT);
