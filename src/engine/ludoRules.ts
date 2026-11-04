/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AIDifficulty,
  GameMode,
  GameState,
  MoveHistoryItem,
  Player,
  PlayerColor,
  Token,
} from '../types/game';
import {
  COLOR_START_INDEX,
  getGlobalTrackIndex,
  isSafeSquare,
} from './ludoCoordinates';

export const TOTAL_STEPS = 56;
export const TRACK_STEPS = 50;

/**
 * Creates initial tokens for a player
 */
export function createInitialTokens(color: PlayerColor): Token[] {
  return [0, 1, 2, 3].map((id) => ({
    id,
    color,
    step: -1,
  }));
}

/**
 * Creates initial player objects based on mode, AI count, difficulty, and player names
 */
export function createInitialPlayers(
  mode: GameMode,
  options?: {
    humanName?: string;
    humanColor?: PlayerColor;
    aiCount?: number;
    aiDifficulty?: AIDifficulty;
    playerNames?: string[];
  }
): Player[] {
  const humanName = options?.humanName?.trim() || 'Player 1';
  const difficulty = options?.aiDifficulty || 'medium';

  if (mode === 'ai') {
    const aiCount = options?.aiCount || 1;
    if (aiCount === 1) {
      // 1 Human vs 1 AI (Opposite sides for perfect balance: Red vs Yellow)
      return [
        {
          id: 'player-1',
          name: humanName,
          color: 'red',
          isAI: false,
          tokens: createInitialTokens('red'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-2',
          name: 'AI Master',
          color: 'yellow',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('yellow'),
          hasWon: false,
          capturesCount: 0,
        },
      ];
    } else if (aiCount === 2) {
      // 1 Human vs 2 AI: Red, Green, Yellow
      return [
        {
          id: 'player-1',
          name: humanName,
          color: 'red',
          isAI: false,
          tokens: createInitialTokens('red'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-2',
          name: 'AI Emerald',
          color: 'green',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('green'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-3',
          name: 'AI Gold',
          color: 'yellow',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('yellow'),
          hasWon: false,
          capturesCount: 0,
        },
      ];
    } else {
      // 1 Human vs 3 AI: Red, Green, Yellow, Blue
      return [
        {
          id: 'player-1',
          name: humanName,
          color: 'red',
          isAI: false,
          tokens: createInitialTokens('red'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-2',
          name: 'AI Emerald',
          color: 'green',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('green'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-3',
          name: 'AI Gold',
          color: 'yellow',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('yellow'),
          hasWon: false,
          capturesCount: 0,
        },
        {
          id: 'player-4',
          name: 'AI Sapphire',
          color: 'blue',
          isAI: true,
          aiDifficulty: difficulty,
          tokens: createInitialTokens('blue'),
          hasWon: false,
          capturesCount: 0,
        },
      ];
    }
  }

  if (mode === 'local2') {
    const names = options?.playerNames || ['Player 1', 'Player 2'];
    return [
      {
        id: 'player-1',
        name: names[0] || 'Player 1',
        color: 'red',
        isAI: false,
        tokens: createInitialTokens('red'),
        hasWon: false,
        capturesCount: 0,
      },
      {
        id: 'player-2',
        name: names[1] || 'Player 2',
        color: 'yellow',
        isAI: false,
        tokens: createInitialTokens('yellow'),
        hasWon: false,
        capturesCount: 0,
      },
    ];
  }

  if (mode === 'local3') {
    const names = options?.playerNames || ['Player 1', 'Player 2', 'Player 3'];
    return [
      {
        id: 'player-1',
        name: names[0] || 'Player 1',
        color: 'red',
        isAI: false,
        tokens: createInitialTokens('red'),
        hasWon: false,
        capturesCount: 0,
      },
      {
        id: 'player-2',
        name: names[1] || 'Player 2',
        color: 'green',
        isAI: false,
        tokens: createInitialTokens('green'),
        hasWon: false,
        capturesCount: 0,
      },
      {
        id: 'player-3',
        name: names[2] || 'Player 3',
        color: 'yellow',
        isAI: false,
        tokens: createInitialTokens('yellow'),
        hasWon: false,
        capturesCount: 0,
      },
    ];
  }

  // mode === 'local4'
  const names = options?.playerNames || ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
  return [
    {
      id: 'player-1',
      name: names[0] || 'Player 1',
      color: 'red',
      isAI: false,
      tokens: createInitialTokens('red'),
      hasWon: false,
      capturesCount: 0,
    },
    {
      id: 'player-2',
      name: names[1] || 'Player 2',
      color: 'green',
      isAI: false,
      tokens: createInitialTokens('green'),
      hasWon: false,
      capturesCount: 0,
    },
    {
      id: 'player-3',
      name: names[2] || 'Player 3',
      color: 'yellow',
      isAI: false,
      tokens: createInitialTokens('yellow'),
      hasWon: false,
      capturesCount: 0,
    },
    {
      id: 'player-4',
      name: names[3] || 'Player 4',
      color: 'blue',
      isAI: false,
      tokens: createInitialTokens('blue'),
      hasWon: false,
      capturesCount: 0,
    },
  ];
}

/**
 * Initializes a new clean game state
 */
export function createNewGameState(
  mode: GameMode,
  options?: {
    humanName?: string;
    humanColor?: PlayerColor;
    aiCount?: number;
    aiDifficulty?: AIDifficulty;
    playerNames?: string[];
  }
): GameState {
  const players = createInitialPlayers(mode, options);
  return {
    id: `game-${Date.now()}`,
    mode,
    players,
    activePlayerIndex: 0,
    currentDiceValue: null,
    consecutiveSixes: 0,
    turnPhase: 'rolling',
    legalMoves: [],
    winnerRankings: [],
    isGameOver: false,
    history: [
      {
        id: `hist-${Date.now()}`,
        timestamp: Date.now(),
        playerIndex: 0,
        playerName: players[0].name,
        playerColor: players[0].color,
        action: 'pass',
        message: `Game started! ${players[0].name}'s turn to roll.`,
      },
    ],
    startedAt: Date.now(),
    turnTimeRemaining: 0,
  };
}

/**
 * Check if a single token can legally move given a dice value
 */
export function canMoveToken(token: Token, diceValue: number): boolean {
  if (token.step === TOTAL_STEPS) {
    // Already in home
    return false;
  }

  if (token.step === -1) {
    // Token is in yard: needs exactly a 6 to release
    return diceValue === 6;
  }

  // Token is on track or home path: target step must not exceed 56
  const targetStep = token.step + diceValue;
  return targetStep <= TOTAL_STEPS;
}

/**
 * Returns list of token IDs that can legally move for the active player with diceValue
 */
export function getLegalTokenMoves(player: Player, diceValue: number): number[] {
  if (player.hasWon) return [];
  const moves: number[] = [];
  for (const token of player.tokens) {
    if (canMoveToken(token, diceValue)) {
      moves.push(token.id);
    }
  }
  return moves;
}

/**
 * Executes a move for the specified token and updates game state
 */
export interface MoveResult {
  nextState: GameState;
  released: boolean;
  captured: boolean;
  capturedColor?: PlayerColor;
  reachedHome: boolean;
  hasWon: boolean;
  extraTurn: boolean;
}

export function executeMove(
  currentState: GameState,
  tokenId: number
): MoveResult {
  const dice = currentState.currentDiceValue;
  if (dice === null || !currentState.legalMoves.includes(tokenId)) {
    throw new Error('Invalid move attempt');
  }

  const activePlayer = currentState.players[currentState.activePlayerIndex];
  const updatedPlayers = currentState.players.map((p) => ({
    ...p,
    tokens: p.tokens.map((t) => ({ ...t })),
  }));
  const movingPlayer = updatedPlayers[currentState.activePlayerIndex];
  const movingToken = movingPlayer.tokens.find((t) => t.id === tokenId)!;

  let released = false;
  let reachedHome = false;
  let captured = false;
  let capturedColor: PlayerColor | undefined;

  const historyEntries: MoveHistoryItem[] = [...currentState.history];

  if (movingToken.step === -1) {
    // Release from yard to start square (step 0)
    movingToken.step = 0;
    released = true;
    historyEntries.unshift({
      id: `hist-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      playerIndex: currentState.activePlayerIndex,
      playerName: movingPlayer.name,
      playerColor: movingPlayer.color,
      action: 'release',
      diceValue: dice,
      tokenId,
      message: `${movingPlayer.name} rolled a 6 and released a token!`,
    });
  } else {
    // Move along track or home path
    movingToken.step += dice;
    if (movingToken.step === TOTAL_STEPS) {
      reachedHome = true;
      historyEntries.unshift({
        id: `hist-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        playerIndex: currentState.activePlayerIndex,
        playerName: movingPlayer.name,
        playerColor: movingPlayer.color,
        action: 'home',
        diceValue: dice,
        tokenId,
        message: `${movingPlayer.name}'s token reached Home!`,
      });
    } else {
      historyEntries.unshift({
        id: `hist-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        playerIndex: currentState.activePlayerIndex,
        playerName: movingPlayer.name,
        playerColor: movingPlayer.color,
        action: 'move',
        diceValue: dice,
        tokenId,
        message: `${movingPlayer.name} moved a token ${dice} step${dice > 1 ? 's' : ''}.`,
      });
    }
  }

  // Check capture if landing on common track (0..50)
  if (movingToken.step >= 0 && movingToken.step <= TRACK_STEPS) {
    const landingGlobalIndex = getGlobalTrackIndex(movingPlayer.color, movingToken.step);
    if (!isSafeSquare(landingGlobalIndex)) {
      // Check for opponent tokens on this square
      for (let pi = 0; pi < updatedPlayers.length; pi++) {
        if (pi === currentState.activePlayerIndex) continue;
        const opponent = updatedPlayers[pi];
        for (const oppToken of opponent.tokens) {
          if (oppToken.step >= 0 && oppToken.step <= TRACK_STEPS) {
            const oppGlobalIndex = getGlobalTrackIndex(opponent.color, oppToken.step);
            if (oppGlobalIndex === landingGlobalIndex) {
              // Captured! Send back to yard
              oppToken.step = -1;
              captured = true;
              capturedColor = opponent.color;
              movingPlayer.capturesCount += 1;
              historyEntries.unshift({
                id: `hist-${Date.now()}-${Math.random()}`,
                timestamp: Date.now(),
                playerIndex: currentState.activePlayerIndex,
                playerName: movingPlayer.name,
                playerColor: movingPlayer.color,
                action: 'capture',
                diceValue: dice,
                tokenId,
                message: `${movingPlayer.name} captured ${opponent.name}'s token!`,
              });
            }
          }
        }
      }
    }
  }

  // Check win condition for moving player
  const allHome = movingPlayer.tokens.every((t) => t.step === TOTAL_STEPS);
  let justWon = false;
  const newWinnerRankings = [...currentState.winnerRankings];
  if (allHome && !movingPlayer.hasWon) {
    movingPlayer.hasWon = true;
    justWon = true;
    newWinnerRankings.push(movingPlayer.color);
    movingPlayer.rank = newWinnerRankings.length;
    historyEntries.unshift({
      id: `hist-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      playerIndex: currentState.activePlayerIndex,
      playerName: movingPlayer.name,
      playerColor: movingPlayer.color,
      action: 'home',
      message: `${movingPlayer.name} finished in Rank #${movingPlayer.rank}!`,
    });
  }

  // Check if overall game is over: only 1 or 0 players left who haven't won
  const remainingPlayers = updatedPlayers.filter((p) => !p.hasWon);
  const isGameOver = remainingPlayers.length <= 1;

  if (isGameOver && remainingPlayers.length === 1 && !remainingPlayers[0].hasWon) {
    const lastPlayer = remainingPlayers[0];
    newWinnerRankings.push(lastPlayer.color);
    lastPlayer.rank = newWinnerRankings.length;
  }

  // Determine extra turn:
  // Rolling 6, token capture, or reaching home grants an extra turn
  const earnedBonus = dice === 6 || captured || reachedHome;
  const extraTurn = !isGameOver && !justWon && earnedBonus;

  let nextPlayerIndex = currentState.activePlayerIndex;
  let nextConsecutiveSixes = currentState.consecutiveSixes;

  if (!extraTurn) {
    nextConsecutiveSixes = 0;
    nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentState.activePlayerIndex);
  }

  const nextState: GameState = {
    ...currentState,
    players: updatedPlayers,
    activePlayerIndex: nextPlayerIndex,
    currentDiceValue: null,
    consecutiveSixes: nextConsecutiveSixes,
    turnPhase: 'rolling',
    legalMoves: [],
    winnerRankings: newWinnerRankings,
    isGameOver,
    history: historyEntries.slice(0, 50), // keep recent 50 entries
  };

  return {
    nextState,
    released,
    captured,
    capturedColor,
    reachedHome,
    hasWon: justWon,
    extraTurn,
  };
}

/**
 * Finds next player index who hasn't won yet
 */
export function getNextActivePlayerIndex(
  players: Player[],
  currentIndex: number
): number {
  const total = players.length;
  for (let offset = 1; offset <= total; offset++) {
    const nextIdx = (currentIndex + offset) % total;
    if (!players[nextIdx].hasWon) {
      return nextIdx;
    }
  }
  return currentIndex;
}

/**
 * Pass turn when active player has no legal moves (or rolls 3 consecutive sixes)
 */
export function passTurn(currentState: GameState, reason: 'no-moves' | 'three-sixes'): GameState {
  const activePlayer = currentState.players[currentState.activePlayerIndex];
  const nextPlayerIndex = getNextActivePlayerIndex(currentState.players, currentState.activePlayerIndex);

  const historyEntries = [...currentState.history];
  if (reason === 'three-sixes') {
    historyEntries.unshift({
      id: `hist-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      playerIndex: currentState.activePlayerIndex,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      action: 'pass',
      message: `${activePlayer.name} rolled three consecutive 6s! Turn forfeited.`,
    });
  } else {
    historyEntries.unshift({
      id: `hist-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      playerIndex: currentState.activePlayerIndex,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      action: 'pass',
      message: `${activePlayer.name} rolled ${currentState.currentDiceValue} (no legal moves).`,
    });
  }

  return {
    ...currentState,
    activePlayerIndex: nextPlayerIndex,
    currentDiceValue: null,
    consecutiveSixes: 0,
    turnPhase: 'rolling',
    legalMoves: [],
    history: historyEntries.slice(0, 50),
  };
}

/**
 * AI Decision Maker
 */
export function chooseAIMove(
  gameState: GameState,
  playerIndex: number,
  diceValue: number,
  difficulty: AIDifficulty = 'medium'
): number {
  const player = gameState.players[playerIndex];
  const legalMoves = gameState.legalMoves;

  if (legalMoves.length === 0) return -1;
  if (legalMoves.length === 1) return legalMoves[0];

  if (difficulty === 'easy') {
    // Random legal move
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }

  // Scoring function for each candidate move
  let bestTokenId = legalMoves[0];
  let bestScore = -Infinity;

  for (const tokenId of legalMoves) {
    const token = player.tokens.find((t) => t.id === tokenId)!;
    let score = 0;

    const oldStep = token.step;
    const newStep = oldStep === -1 ? 0 : oldStep + diceValue;

    // 1. Releasing from yard on a 6 is high priority
    if (oldStep === -1 && diceValue === 6) {
      score += difficulty === 'hard' ? 95 : 60;
    }

    // 2. Reaching Home directly
    if (newStep === TOTAL_STEPS) {
      score += 150;
    }

    // 3. Entering home stretch (safe from all attacks)
    if (oldStep <= TRACK_STEPS && newStep > TRACK_STEPS) {
      score += difficulty === 'hard' ? 70 : 40;
    }

    // Check common track landing
    if (newStep >= 0 && newStep <= TRACK_STEPS) {
      const landingGlobalIndex = getGlobalTrackIndex(player.color, newStep);
      const isLandingSafe = isSafeSquare(landingGlobalIndex);

      // Check capture potential
      let canCapture = false;
      for (let pi = 0; pi < gameState.players.length; pi++) {
        if (pi === playerIndex) continue;
        const opponent = gameState.players[pi];
        for (const oppToken of opponent.tokens) {
          if (oppToken.step >= 0 && oppToken.step <= TRACK_STEPS) {
            const oppGlobal = getGlobalTrackIndex(opponent.color, oppToken.step);
            if (oppGlobal === landingGlobalIndex && !isLandingSafe) {
              canCapture = true;
              break;
            }
          }
        }
        if (canCapture) break;
      }

      if (canCapture) {
        score += difficulty === 'hard' ? 160 : 90;
      }

      // Safe square reward
      if (isLandingSafe) {
        score += difficulty === 'hard' ? 50 : 25;
      }

      if (difficulty === 'hard') {
        // Danger evaluation:
        // A) If current position is in danger and moving escapes it
        if (oldStep >= 0 && oldStep <= TRACK_STEPS) {
          const currentGlobalIndex = getGlobalTrackIndex(player.color, oldStep);
          if (!isSafeSquare(currentGlobalIndex)) {
            // Is an opponent within 1..6 steps behind current position?
            for (let pi = 0; pi < gameState.players.length; pi++) {
              if (pi === playerIndex) continue;
              const opponent = gameState.players[pi];
              for (const oppToken of opponent.tokens) {
                if (oppToken.step >= 0 && oppToken.step <= TRACK_STEPS) {
                  const oppGlobal = getGlobalTrackIndex(opponent.color, oppToken.step);
                  const dist = (currentGlobalIndex - oppGlobal + 52) % 52;
                  if (dist >= 1 && dist <= 6) {
                    score += 65; // Escaping immediate threat
                  }
                }
              }
            }
          }
        }

        // B) Avoid landing in danger (opponent 1..6 steps behind new square)
        if (!isLandingSafe) {
          for (let pi = 0; pi < gameState.players.length; pi++) {
            if (pi === playerIndex) continue;
            const opponent = gameState.players[pi];
            for (const oppToken of opponent.tokens) {
              if (oppToken.step >= 0 && oppToken.step <= TRACK_STEPS) {
                const oppGlobal = getGlobalTrackIndex(opponent.color, oppToken.step);
                const dist = (landingGlobalIndex - oppGlobal + 52) % 52;
                if (dist >= 1 && dist <= 6) {
                  score -= 45; // Vulnerable to capture
                }
              }
            }
          }
        }
      }
    }

    // Step progress reward: Advancing further gets a steady bonus
    score += newStep * 0.5;

    if (score > bestScore) {
      bestScore = score;
      bestTokenId = tokenId;
    }
  }

  return bestTokenId;
}
