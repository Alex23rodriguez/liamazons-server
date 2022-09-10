import { INVALID_MOVE } from "boardgame.io/core";
import { Amazons, DEFAULT_POSITIONS } from "amazons-game-engine";

import type { Game, MoveFn, MoveMap, TurnConfig } from "boardgame.io";
import type { FEN, GameState, Move } from "amazons-game-engine/dist/types";

export type AmazonsState = GameState;

export interface SetupData {
  fen: FEN;
}

function Load(state: GameState): Amazons;
function Load(fen: FEN): Amazons;
function Load(param: any) {
  return new Amazons(param);
}

export const AmazonsGame: Game<AmazonsState> = {
  name: "amazons",

  minPlayers: 2,
  maxPlayers: 2,

  setup: (_, setupData: SetupData) => {
    // TODO: be careful not to give this an invalid fen! maybe return default if so
    let amz: Amazons;
    if (setupData?.fen) {
      amz = Load(setupData.fen);
      return amz.state();
    }
    amz = Load(DEFAULT_POSITIONS[10]!);
    return amz.state();
  },

  moves: {
    move: ((G, ctx, m: Move) => {
      const amz = Load(G);
      if (
        (amz.turn() == "w" && ctx.currentPlayer == "1") ||
        (amz.turn() == "b" && ctx.currentPlayer == "0")
      ) {
        console.error("wrong player!");
        return INVALID_MOVE;
      }
      const success = amz.move(m);
      if (!success) {
        console.error("move was invalid!");
        return INVALID_MOVE;
      }
      return amz.state();
    }) as MoveFn<AmazonsState>,

    random_move: ((G) => {
      const amz = Load(G);
      amz.random_move();
      return amz.state();
    }) as MoveFn<AmazonsState>,
  } as MoveMap<AmazonsState>,

  turn: {
    minMoves: 2,
    maxMoves: 2,
  } as TurnConfig,

  endIf: (G) => {
    const amazons = Load(G);
    if (amazons.game_over()) return amazons.turn(true);
  },
};
