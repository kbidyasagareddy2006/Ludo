/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Player, PlayerColor, Token } from '../types/game';
import {
  COMMON_TRACK_COORDS,
  getTokenGridCoord,
  HOME_PATHS,
  SAFE_TRACK_INDICES,
} from '../engine/ludoCoordinates';

interface BoardProps {
  players: Player[];
  activeColor: PlayerColor;
  legalMoves: number[]; // token IDs of the active player that can be legally moved
  turnPhase: 'rolling' | 'moving' | 'passed';
  onSelectToken: (tokenId: number) => void;
  movingTokenId?: number | null;
}

const CELL_SIZE = 40; // 15 cells * 40 = 600px width/height

// Player color themes
const COLOR_CONFIG: Record<
  PlayerColor,
  {
    primary: string;
    light: string;
    dark: string;
    fillGradient: [string, string];
    tokenGradient: [string, string];
    stroke: string;
    border: string;
    label: string;
  }
> = {
  red: {
    primary: '#ef4444',
    light: '#fee2e2',
    dark: '#b91c1c',
    fillGradient: ['#f87171', '#dc2626'],
    tokenGradient: ['#fca5a5', '#dc2626'],
    stroke: '#991b1b',
    border: '#f87171',
    label: 'Red',
  },
  green: {
    primary: '#10b981',
    light: '#d1fae5',
    dark: '#047857',
    fillGradient: ['#34d399', '#059669'],
    tokenGradient: ['#6ee7b7', '#059669'],
    stroke: '#065f46',
    border: '#34d399',
    label: 'Green',
  },
  yellow: {
    primary: '#f59e0b',
    light: '#fef3c7',
    dark: '#b45309',
    fillGradient: ['#fbbf24', '#d97706'],
    tokenGradient: ['#fde68a', '#d97706'],
    stroke: '#92400e',
    border: '#fbbf24',
    label: 'Yellow',
  },
  blue: {
    primary: '#3b82f6',
    light: '#dbeafe',
    dark: '#1d4ed8',
    fillGradient: ['#60a5fa', '#2563eb'],
    tokenGradient: ['#93c5fd', '#2563eb'],
    stroke: '#1e40af',
    border: '#60a5fa',
    label: 'Blue',
  },
};

export const Board: React.FC<BoardProps> = ({
  players,
  activeColor,
  legalMoves,
  turnPhase,
  onSelectToken,
}) => {
  // Determine which player colors are in this match
  const activeColorSet = useMemo(() => {
    return new Set(players.map((p) => p.color));
  }, [players]);

  const activePlayer = useMemo(() => {
    return players.find((p) => p.color === activeColor);
  }, [players, activeColor]);

  // Group all tokens on board by their approximate grid location to handle stacking offsets
  const tokenGroups = useMemo(() => {
    const map = new Map<string, Array<{ player: Player; token: Token }>>();

    for (const player of players) {
      for (const token of player.tokens) {
        let key = '';
        if (token.step === -1) {
          key = `yard-${player.color}-${token.id}`;
        } else if (token.step === 56) {
          key = `home-${player.color}`;
        } else {
          const coord = getTokenGridCoord(player.color, token.id, token.step);
          key = `coord-${Math.round(coord.row * 10)}-${Math.round(coord.col * 10)}`;
        }

        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push({ player, token });
      }
    }
    return map;
  }, [players]);

  // Calculate pixel offsets for multiple tokens on the same square
  const getTokenOffset = (indexInGroup: number, totalInGroup: number): [number, number] => {
    if (totalInGroup <= 1) return [0, 0];
    if (totalInGroup === 2) {
      return indexInGroup === 0 ? [-6, -6] : [6, 6];
    }
    if (totalInGroup === 3) {
      if (indexInGroup === 0) return [0, -7];
      if (indexInGroup === 1) return [-6, 6];
      return [6, 6];
    }
    // 4 or more
    const positions: [number, number][] = [
      [-7, -7],
      [7, -7],
      [-7, 7],
      [7, 7],
    ];
    return positions[indexInGroup % 4] || [0, 0];
  };

  // Safe star SVG path centered at (cx, cy)
  const renderStar = (cx: number, cy: number, size = 10, fill = '#fbbf24') => {
    const points: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle1 = (i * 72 - 90) * (Math.PI / 180);
      const angle2 = ((i * 72 + 36) - 90) * (Math.PI / 180);
      points.push(`${cx + size * Math.cos(angle1)},${cy + size * Math.sin(angle1)}`);
      points.push(`${cx + (size * 0.45) * Math.cos(angle2)},${cy + (size * 0.45) * Math.sin(angle2)}`);
    }
    return (
      <polygon
        points={points.join(' ')}
        fill={fill}
        stroke="#d97706"
        strokeWidth="1.2"
        className="drop-shadow-sm pointer-events-none"
      />
    );
  };

  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto select-none p-1 sm:p-2 bg-gradient-to-br from-amber-100/80 via-white to-amber-50 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] border-4 border-amber-900/15">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full rounded-2xl overflow-hidden drop-shadow-sm"
      >
        <defs>
          {/* Gradients for Yards and Home Paths */}
          <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Token gradients */}
          <radialGradient id="tokenRed" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          <radialGradient id="tokenGreen" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          <radialGradient id="tokenYellow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>
          <radialGradient id="tokenBlue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>

          {/* Shadow filters for tokens */}
          <filter id="tokenShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. BOARD BACKGROUND */}
        <rect x="0" y="0" width="600" height="600" fill="#f8fafc" />

        {/* 2. BASE YARDS (4 Corners, 6x6 cells = 240x240 each) */}
        {/* Red Yard (Top-Left: 0, 0) */}
        <g opacity={activeColorSet.has('red') ? 1 : 0.45}>
          <rect
            x="0"
            y="0"
            width="240"
            height="240"
            fill="url(#redGradient)"
            stroke="#991b1b"
            strokeWidth="1.5"
          />
          <rect
            x="36"
            y="36"
            width="168"
            height="168"
            rx="24"
            fill="#ffffff"
            stroke="#fca5a5"
            strokeWidth="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          {/* 4 Pedestals for Red tokens */}
          {[
            [72, 72],
            [152, 72],
            [72, 152],
            [152, 152],
          ].map(([px, py], i) => (
            <circle
              key={`red-ped-${i}`}
              cx={px}
              cy={py}
              r="22"
              fill="#fee2e2"
              stroke="#ef4444"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Green Yard (Top-Right: 360, 0) */}
        <g opacity={activeColorSet.has('green') ? 1 : 0.45}>
          <rect
            x="360"
            y="0"
            width="240"
            height="240"
            fill="url(#greenGradient)"
            stroke="#065f46"
            strokeWidth="1.5"
          />
          <rect
            x="396"
            y="36"
            width="168"
            height="168"
            rx="24"
            fill="#ffffff"
            stroke="#6ee7b7"
            strokeWidth="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          {/* 4 Pedestals for Green tokens */}
          {[
            [432, 72],
            [512, 72],
            [432, 152],
            [512, 152],
          ].map(([px, py], i) => (
            <circle
              key={`green-ped-${i}`}
              cx={px}
              cy={py}
              r="22"
              fill="#d1fae5"
              stroke="#10b981"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Yellow Yard (Bottom-Right: 360, 360) */}
        <g opacity={activeColorSet.has('yellow') ? 1 : 0.45}>
          <rect
            x="360"
            y="360"
            width="240"
            height="240"
            fill="url(#yellowGradient)"
            stroke="#92400e"
            strokeWidth="1.5"
          />
          <rect
            x="396"
            y="396"
            width="168"
            height="168"
            rx="24"
            fill="#ffffff"
            stroke="#fde68a"
            strokeWidth="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          {/* 4 Pedestals for Yellow tokens */}
          {[
            [432, 432],
            [512, 432],
            [432, 512],
            [512, 512],
          ].map(([px, py], i) => (
            <circle
              key={`yellow-ped-${i}`}
              cx={px}
              cy={py}
              r="22"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Blue Yard (Bottom-Left: 0, 360) */}
        <g opacity={activeColorSet.has('blue') ? 1 : 0.45}>
          <rect
            x="0"
            y="360"
            width="240"
            height="240"
            fill="url(#blueGradient)"
            stroke="#1e40af"
            strokeWidth="1.5"
          />
          <rect
            x="36"
            y="396"
            width="168"
            height="168"
            rx="24"
            fill="#ffffff"
            stroke="#93c5fd"
            strokeWidth="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          {/* 4 Pedestals for Blue tokens */}
          {[
            [72, 432],
            [152, 432],
            [72, 512],
            [152, 512],
          ].map(([px, py], i) => (
            <circle
              key={`blue-ped-${i}`}
              cx={px}
              cy={py}
              r="22"
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* 3. TRACK SQUARES (52 Common Track Cells) */}
        {COMMON_TRACK_COORDS.map((coord, index) => {
          const x = coord.col * CELL_SIZE;
          const y = coord.row * CELL_SIZE;
          const isSafe = SAFE_TRACK_INDICES.has(index);

          // Starting cell styling
          let cellFill = '#ffffff';
          let isStartCell = false;
          let startColor: PlayerColor | null = null;

          if (index === 0) {
            cellFill = activeColorSet.has('red') ? '#fee2e2' : '#ffffff';
            isStartCell = true;
            startColor = 'red';
          } else if (index === 13) {
            cellFill = activeColorSet.has('green') ? '#d1fae5' : '#ffffff';
            isStartCell = true;
            startColor = 'green';
          } else if (index === 26) {
            cellFill = activeColorSet.has('yellow') ? '#fef3c7' : '#ffffff';
            isStartCell = true;
            startColor = 'yellow';
          } else if (index === 39) {
            cellFill = activeColorSet.has('blue') ? '#dbeafe' : '#ffffff';
            isStartCell = true;
            startColor = 'blue';
          }

          return (
            <g key={`track-cell-${index}`}>
              <rect
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={cellFill}
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Start square arrow / emblem */}
              {isStartCell && startColor && (
                <rect
                  x={x + 3}
                  y={y + 3}
                  width={CELL_SIZE - 6}
                  height={CELL_SIZE - 6}
                  rx="6"
                  fill={COLOR_CONFIG[startColor].primary}
                  opacity="0.9"
                />
              )}

              {/* Safe star render */}
              {isSafe && renderStar(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 11)}
            </g>
          );
        })}

        {/* 4. HOME PATHS (5 colored steps for each color) */}
        {/* Red Home Path (row 7, cols 1..5) */}
        {HOME_PATHS.red.map((coord, i) => (
          <rect
            key={`red-home-${i}`}
            x={coord.col * CELL_SIZE}
            y={coord.row * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="1"
            opacity={activeColorSet.has('red') ? 1 : 0.4}
          />
        ))}

        {/* Green Home Path (rows 1..5, col 7) */}
        {HOME_PATHS.green.map((coord, i) => (
          <rect
            key={`green-home-${i}`}
            x={coord.col * CELL_SIZE}
            y={coord.row * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#10b981"
            stroke="#059669"
            strokeWidth="1"
            opacity={activeColorSet.has('green') ? 1 : 0.4}
          />
        ))}

        {/* Yellow Home Path (row 7, cols 9..13) */}
        {HOME_PATHS.yellow.map((coord, i) => (
          <rect
            key={`yellow-home-${i}`}
            x={coord.col * CELL_SIZE}
            y={coord.row * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1"
            opacity={activeColorSet.has('yellow') ? 1 : 0.4}
          />
        ))}

        {/* Blue Home Path (rows 9..13, col 7) */}
        {HOME_PATHS.blue.map((coord, i) => (
          <rect
            key={`blue-home-${i}`}
            x={coord.col * CELL_SIZE}
            y={coord.row * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#3b82f6"
            stroke="#2563eb"
            strokeWidth="1"
            opacity={activeColorSet.has('blue') ? 1 : 0.4}
          />
        ))}

        {/* 5. CENTER HOME TRIANGLES (cols 6..8, rows 6..8 = 240..360) */}
        {/* Left triangle (Red) */}
        <polygon
          points="240,240 300,300 240,360"
          fill="url(#redGradient)"
          stroke="#b91c1c"
          strokeWidth="1.5"
          opacity={activeColorSet.has('red') ? 1 : 0.4}
        />
        {/* Top triangle (Green) */}
        <polygon
          points="240,240 300,300 360,240"
          fill="url(#greenGradient)"
          stroke="#047857"
          strokeWidth="1.5"
          opacity={activeColorSet.has('green') ? 1 : 0.4}
        />
        {/* Right triangle (Yellow) */}
        <polygon
          points="360,240 300,300 360,360"
          fill="url(#yellowGradient)"
          stroke="#b45309"
          strokeWidth="1.5"
          opacity={activeColorSet.has('yellow') ? 1 : 0.4}
        />
        {/* Bottom triangle (Blue) */}
        <polygon
          points="240,360 300,300 360,360"
          fill="url(#blueGradient)"
          stroke="#1d4ed8"
          strokeWidth="1.5"
          opacity={activeColorSet.has('blue') ? 1 : 0.4}
        />

        {/* Center Golden Medallion */}
        <circle cx="300" cy="300" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        {renderStar(300, 300, 8, '#ffffff')}

        {/* 6. TOKENS LAYER */}
        {players.map((player) => {
          return player.tokens.map((token) => {
            const isLegal =
              player.color === activeColor &&
              turnPhase === 'moving' &&
              legalMoves.includes(token.id) &&
              !activePlayer?.isAI;

            // Find token's group to calculate offset
            let groupKey = '';
            if (token.step === -1) {
              groupKey = `yard-${player.color}-${token.id}`;
            } else if (token.step === 56) {
              groupKey = `home-${player.color}`;
            } else {
              const coord = getTokenGridCoord(player.color, token.id, token.step);
              groupKey = `coord-${Math.round(coord.row * 10)}-${Math.round(coord.col * 10)}`;
            }

            const group = tokenGroups.get(groupKey) || [];
            const indexInGroup = group.findIndex(
              (item) => item.player.id === player.id && item.token.id === token.id
            );
            const [offsetX, offsetY] = getTokenOffset(
              indexInGroup >= 0 ? indexInGroup : 0,
              group.length
            );

            // Compute center point for this token
            const coord = getTokenGridCoord(player.color, token.id, token.step);
            let cx = coord.col * CELL_SIZE + CELL_SIZE / 2 + offsetX;
            let cy = coord.row * CELL_SIZE + CELL_SIZE / 2 + offsetY;

            // Yard tokens are exact on pedestals
            if (token.step === -1) {
              const pedestalMap: Record<PlayerColor, [number, number][]> = {
                red: [
                  [72, 72],
                  [152, 72],
                  [72, 152],
                  [152, 152],
                ],
                green: [
                  [432, 72],
                  [512, 72],
                  [432, 152],
                  [512, 152],
                ],
                yellow: [
                  [432, 432],
                  [512, 432],
                  [432, 512],
                  [512, 512],
                ],
                blue: [
                  [72, 432],
                  [152, 432],
                  [72, 512],
                  [152, 512],
                ],
              };
              const [px, py] = pedestalMap[player.color][token.id];
              cx = px;
              cy = py;
            }

            // Radial gradient ID for this color
            const gradId =
              player.color === 'red'
                ? 'tokenRed'
                : player.color === 'green'
                ? 'tokenGreen'
                : player.color === 'yellow'
                ? 'tokenYellow'
                : 'tokenBlue';

            const tokenRadius = group.length > 2 ? 11 : 13;

            return (
              <g
                key={`token-${player.color}-${token.id}`}
                onClick={() => {
                  if (isLegal) {
                    onSelectToken(token.id);
                  }
                }}
                className={`transition-all duration-300 ${
                  isLegal ? 'cursor-pointer hover:scale-110' : ''
                }`}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                {/* Pulsing ring indicator for legal moves */}
                {isLegal && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={tokenRadius + 6}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    className="animate-ping opacity-85"
                  />
                )}

                {/* Outer shadow / base rim */}
                <circle
                  cx={cx}
                  cy={cy + 1}
                  r={tokenRadius}
                  fill="rgba(0,0,0,0.4)"
                  filter="url(#tokenShadow)"
                />

                {/* Main 3D Token Body */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={tokenRadius}
                  fill={`url(#${gradId})`}
                  stroke={isLegal ? '#ffffff' : COLOR_CONFIG[player.color].stroke}
                  strokeWidth={isLegal ? 2.5 : 1.5}
                />

                {/* Inner gloss ring */}
                <circle
                  cx={cx}
                  cy={cy - 1}
                  r={tokenRadius - 3.5}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.2"
                />

                {/* Crown / Token Number Emblem */}
                {token.step === 56 ? (
                  // Reached Home Crown
                  <text
                    x={cx}
                    y={cy + 3.5}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#ffffff"
                    className="pointer-events-none select-none"
                  >
                    ★
                  </text>
                ) : (
                  <text
                    x={cx}
                    y={cy + 3.5}
                    fontSize={group.length > 2 ? '8' : '9.5'}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#ffffff"
                    className="pointer-events-none select-none drop-shadow-sm font-sans"
                  >
                    {token.id + 1}
                  </text>
                )}
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
};
