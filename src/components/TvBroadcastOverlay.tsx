import React from 'react';
import { MatchFormatConfig, GameScore } from '../types/badminton';

interface TvBroadcastOverlayProps {
  config: MatchFormatConfig;
  gameScores: GameScore[];
  activeGame: number;
  currentScoreA: number;
  currentScoreB: number;
  servingSide: 'A' | 'B';
}

export const TvBroadcastOverlay: React.FC<TvBroadcastOverlayProps> = ({
  config,
  gameScores,
  activeGame,
  currentScoreA,
  currentScoreB,
  servingSide
}) => {
  const isDoubles = config.gameType.includes('doubles');

  const playerAName = isDoubles
    ? `${config.sideA.players[0]?.displayName || 'A1'} / ${config.sideA.players[1]?.displayName || 'A2'}`
    : config.sideA.players[0]?.displayName || config.sideA.name;

  const playerBName = isDoubles
    ? `${config.sideB.players[0]?.displayName || 'B1'} / ${config.sideB.players[1]?.displayName || 'B2'}`
    : config.sideB.players[0]?.displayName || config.sideB.name;

  // Games won
  const gamesWonA = gameScores.filter(g => g.completed && g.winner === 'A').length;
  const gamesWonB = gameScores.filter(g => g.completed && g.winner === 'B').length;

  return (
    <div className="bg-slate-950 text-white p-4 rounded-md shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
        <span className="font-bold tracking-wider text-amber-400 uppercase">
          LIVE TV BROADCAST OVERLAY (16:9 GRAPHIC)
        </span>
        <span className="font-mono text-slate-300">
          {config.competition} · COURT {config.court}
        </span>
      </div>

      {/* Main Broadcast Score Bar (BWF TV Style) */}
      <div className="flex flex-col md:flex-row items-stretch bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded border border-slate-700 overflow-hidden shadow-lg font-sans">
        
        {/* Tournament bug on left */}
        <div className="bg-[#07539b] px-3.5 py-2.5 flex flex-col justify-center text-center border-r border-blue-400/40">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-200">BWF</span>
          <span className="text-[12px] font-black text-white leading-tight">LIVE</span>
          <span className="text-[9px] text-blue-200 font-medium">GIM {activeGame}</span>
        </div>

        {/* Players and scores block */}
        <div className="flex-1 grid grid-rows-2 divide-y divide-slate-800 text-xs">
          
          {/* Row A */}
          <div className="flex items-center px-3 py-1.5 hover:bg-white/5 transition-colors">
            {/* Country code & flag bar */}
            <div className="flex items-center gap-1.5 w-16 shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: config.sideA.jerseyColor }}
              />
              <span className="font-bold font-mono text-slate-200">{config.sideA.code}</span>
              {servingSide === 'A' && (
                <span className="text-amber-400 font-bold text-xs" title="Serving">🏸</span>
              )}
            </div>

            {/* Player name */}
            <div className="flex-1 truncate font-semibold text-white tracking-wide">
              {playerAName}
            </div>

            {/* Previous games scores */}
            <div className="flex items-center gap-1 font-mono text-slate-400 px-2">
              {gameScores.map((g, idx) => (
                <span
                  key={idx}
                  className={`w-6 text-center tabular-nums ${g.gameNumber === activeGame ? 'hidden' : ''}`}
                >
                  {g.completed ? g.scoreA : '-'}
                </span>
              ))}
            </div>

            {/* Games Won box */}
            <div className="w-8 text-center font-bold text-amber-400 bg-slate-800/80 rounded py-0.5 border border-slate-700">
              {gamesWonA}
            </div>

            {/* Current Game Score box */}
            <div className="w-12 text-center text-base font-extrabold text-white bg-[#07539b] ml-1.5 rounded py-0.5 tabular-nums">
              {currentScoreA}
            </div>
          </div>

          {/* Row B */}
          <div className="flex items-center px-3 py-1.5 hover:bg-white/5 transition-colors">
            {/* Country code & flag bar */}
            <div className="flex items-center gap-1.5 w-16 shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: config.sideB.jerseyColor }}
              />
              <span className="font-bold font-mono text-slate-200">{config.sideB.code}</span>
              {servingSide === 'B' && (
                <span className="text-amber-400 font-bold text-xs" title="Serving">🏸</span>
              )}
            </div>

            {/* Player name */}
            <div className="flex-1 truncate font-semibold text-white tracking-wide">
              {playerBName}
            </div>

            {/* Previous games scores */}
            <div className="flex items-center gap-1 font-mono text-slate-400 px-2">
              {gameScores.map((g, idx) => (
                <span
                  key={idx}
                  className={`w-6 text-center tabular-nums ${g.gameNumber === activeGame ? 'hidden' : ''}`}
                >
                  {g.completed ? g.scoreB : '-'}
                </span>
              ))}
            </div>

            {/* Games Won box */}
            <div className="w-8 text-center font-bold text-amber-400 bg-slate-800/80 rounded py-0.5 border border-slate-700">
              {gamesWonB}
            </div>

            {/* Current Game Score box */}
            <div className="w-12 text-center text-base font-extrabold text-white bg-[#07539b] ml-1.5 rounded py-0.5 tabular-nums">
              {currentScoreB}
            </div>
          </div>
        </div>

        {/* Location & Time tag on right */}
        <div className="bg-slate-900 px-3 py-2 flex flex-col justify-center text-right border-l border-slate-800 text-[10px] text-slate-400 font-mono">
          <span className="text-slate-200 font-semibold truncate max-w-[150px]">{config.venue}</span>
          <span>{config.city}, {config.country}</span>
        </div>
      </div>
    </div>
  );
};
