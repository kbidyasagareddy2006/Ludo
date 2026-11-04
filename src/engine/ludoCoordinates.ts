/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerColor } from '../types/game';

export interface GridCoord {
  row: number; // 0..14
  col: number; // 0..14
}

// 52 Common track coordinates in clockwise order starting from Red's start square at (6, 1)
export const COMMON_TRACK_COORDS: GridCoord[] = [
  { row: 6, col: 1 },  // 0: Red start (Safe)
  { row: 6, col: 2 },  // 1
  { row: 6, col: 3 },  // 2
  { row: 6, col: 4 },  // 3
  { row: 6, col: 5 },  // 4
  { row: 5, col: 6 },  // 5
  { row: 4, col: 6 },  // 6
  { row: 3, col: 6 },  // 7
  { row: 2, col: 6 },  // 8: Star Safe
  { row: 1, col: 6 },  // 9
  { row: 0, col: 6 },  // 10
  { row: 0, col: 7 },  // 11
  { row: 0, col: 8 },  // 12
  { row: 1, col: 8 },  // 13: Green start (Safe)
  { row: 2, col: 8 },  // 14
  { row: 3, col: 8 },  // 15
  { row: 4, col: 8 },  // 16
  { row: 5, col: 8 },  // 17
  { row: 6, col: 9 },  // 18
  { row: 6, col: 10 }, // 19
  { row: 6, col: 11 }, // 20
  { row: 6, col: 12 }, // 21: Star Safe
  { row: 6, col: 13 }, // 22
  { row: 6, col: 14 }, // 23
  { row: 7, col: 14 }, // 24
  { row: 8, col: 14 }, // 25
  { row: 8, col: 13 }, // 26: Yellow start (Safe)
  { row: 8, col: 12 }, // 27
  { row: 8, col: 11 }, // 28
  { row: 8, col: 10 }, // 29
  { row: 8, col: 9 },  // 30
  { row: 9, col: 8 },  // 31
  { row: 10, col: 8 }, // 32
  { row: 11, col: 8 }, // 33
  { row: 12, col: 8 }, // 34: Star Safe
  { row: 13, col: 8 }, // 35
  { row: 14, col: 8 }, // 36
  { row: 14, col: 7 }, // 37
  { row: 14, col: 6 }, // 38
  { row: 13, col: 6 }, // 39: Blue start (Safe)
  { row: 12, col: 6 }, // 40
  { row: 11, col: 6 }, // 41
  { row: 10, col: 6 }, // 42
  { row: 9, col: 6 },  // 43
  { row: 8, col: 5 },  // 44
  { row: 8, col: 4 },  // 45
  { row: 8, col: 3 },  // 46
  { row: 8, col: 2 },  // 47: Star Safe
  { row: 8, col: 1 },  // 48
  { row: 8, col: 0 },  // 49
  { row: 7, col: 0 },  // 50
  { row: 6, col: 0 },  // 51
];

// Start global indices for each color
export const COLOR_START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Safe squares on the 52 common track (global indices)
export const SAFE_TRACK_INDICES = new Set<number>([
  0,  // Red start
  8,  // Star 1
  13, // Green start
  21, // Star 2
  26, // Yellow start
  34, // Star 3
  39, // Blue start
  47, // Star 4
]);

// Home columns (steps 51..55)
export const HOME_PATHS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 3 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
  ],
  green: [
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
    { row: 4, col: 7 },
    { row: 5, col: 7 },
  ],
  yellow: [
    { row: 7, col: 13 },
    { row: 7, col: 12 },
    { row: 7, col: 11 },
    { row: 7, col: 10 },
    { row: 7, col: 9 },
  ],
  blue: [
    { row: 13, col: 7 },
    { row: 12, col: 7 },
    { row: 11, col: 7 },
    { row: 10, col: 7 },
    { row: 9, col: 7 },
  ],
};

// Center home triangular coordinates (step 56)
export const HOME_CENTER_COORDS: Record<PlayerColor, GridCoord> = {
  red: { row: 7, col: 6.3 },
  green: { row: 6.3, col: 7 },
  yellow: { row: 7, col: 7.7 },
  blue: { row: 7.7, col: 7 },
};

// Base yard 4 token positions inside each 6x6 corner
export const YARD_TOKEN_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 1.8, col: 1.8 },
    { row: 1.8, col: 3.8 },
    { row: 3.8, col: 1.8 },
    { row: 3.8, col: 3.8 },
  ],
  green: [
    { row: 1.8, col: 10.8 },
    { row: 1.8, col: 12.8 },
    { row: 3.8, col: 10.8 },
    { row: 3.8, col: 12.8 },
  ],
  yellow: [
    { row: 10.8, col: 10.8 },
    { row: 10.8, col: 12.8 },
    { row: 12.8, col: 10.8 },
    { row: 12.8, col: 12.8 },
  ],
  blue: [
    { row: 10.8, col: 1.8 },
    { row: 10.8, col: 3.8 },
    { row: 12.8, col: 1.8 },
    { row: 12.8, col: 3.8 },
  ],
};

/**
 * Returns grid coordinates (row, col) for a given token step (0..56 or -1)
 */
export function getTokenGridCoord(color: PlayerColor, tokenId: number, step: number): GridCoord {
  if (step === -1) {
    return YARD_TOKEN_COORDS[color][tokenId];
  }
  if (step >= 0 && step <= 50) {
    const globalIndex = (COLOR_START_INDEX[color] + step) % 52;
    return COMMON_TRACK_COORDS[globalIndex];
  }
  if (step >= 51 && step <= 55) {
    return HOME_PATHS[color][step - 51];
  }
  if (step === 56) {
    return HOME_CENTER_COORDS[color];
  }
  return { row: 7, col: 7 };
}

/**
 * Returns whether a given common track global index is a safe square
 */
export function isSafeSquare(globalIndex: number): boolean {
  return SAFE_TRACK_INDICES.has(globalIndex);
}

/**
 * Converts token color and step to global track index (if step is on common track)
 * Returns -1 if in yard, on home path, or finished
 */
export function getGlobalTrackIndex(color: PlayerColor, step: number): number {
  if (step >= 0 && step <= 50) {
    return (COLOR_START_INDEX[color] + step) % 52;
  }
  return -1;
}
