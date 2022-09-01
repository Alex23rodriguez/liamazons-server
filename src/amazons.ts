import { INVALID_MOVE } from "boardgame.io/core";
import { Amazons, DEFAULT_POSITIONS } from "amazons-game-engine";

import type { Game, MoveFn, MoveMap, TurnConfig } from "boardgame.io";
import type { FEN, Move } from "amazons-game-engine/dist/types";

export interface AmazonsState {
  fen: FEN;
}
export interface SetupData {
  fen: FEN;
}

function Load(fen: FEN) {
  return Amazons(fen, false); // unsafe loading
}

export const AmazonsGame: Game<AmazonsState> = {
  name: "amazons",

  minPlayers: 2,
  maxPlayers: 2,

  setup: (_, setupData: SetupData) => {
    // TODO: be careful not to give this an invalid fen! maybe return default if so
    if (setupData?.fen) {
      return { fen: setupData.fen };
    }
    return { fen: DEFAULT_POSITIONS[6]! };
  },

  moves: {
    move: ((G, ctx, m: Move) => {
      const amazons = Load(G.fen);
      if (
        (amazons.turn() == "w" && ctx.currentPlayer == "1") ||
        (amazons.turn() == "b" && ctx.currentPlayer == "0")
      ) {
        console.error("wrong player!");
        return INVALID_MOVE;
      }
      const success = amazons.move(m);
      if (!success) {
        console.error("move was invalid!");
        return INVALID_MOVE;
      }
      return { fen: amazons.fen(), last_move: m };
    }) as MoveFn<AmazonsState>,

    random_move: ((G) => {
      const amazons = Load(G.fen);
      const move = amazons.random_move();
      return { fen: amazons.fen(), last_move: move };
    }) as MoveFn<AmazonsState>,
  } as MoveMap<AmazonsState>,

  turn: {
    minMoves: 2,
    maxMoves: 2,
  } as TurnConfig,

  endIf: (G) => {
    const amazons = Load(G.fen);
    if (amazons.game_over()) return amazons.turn(true);
  },
};
