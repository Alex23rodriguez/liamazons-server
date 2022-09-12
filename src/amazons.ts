import { INVALID_MOVE } from "boardgame.io/core";
import { Amazons, DEFAULT_POSITIONS } from "amazons-game-engine";

import type { Game, MoveFn, MoveMap, TurnConfig } from "boardgame.io";
import type {
  FEN,
  GameState,
  Move,
  Square as TSquare,
} from "amazons-game-engine/dist/types";

export interface AmazonsState extends GameState {
  last_move: TSquare[];
}

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
      return { ...amz.state(), last_move: [] };
    }
    amz = Load(DEFAULT_POSITIONS[10]!);
    return { ...amz.state(), last_move: [] };
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
      const last_move =
        m.length === 2 ? (m as TSquare[]) : G.last_move.concat(m as TSquare[]);
      return { ...amz.state(), last_move };
    }) as MoveFn<AmazonsState>,

    random_move: ((G) => {
      const amz = Load(G);
      const m = amz.random_move();
      const last_move =
        m.length === 2 ? (m as TSquare[]) : G.last_move.concat(m as TSquare[]);
      return { ...amz.state(), last_move };
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
