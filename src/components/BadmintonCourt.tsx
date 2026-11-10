import React from 'react';
import { MatchFormatConfig } from '../types/badminton';

interface BadmintonCourtProps {
  config: MatchFormatConfig;
  servingSide: 'A' | 'B';
  scoreA: number;
  scoreB: number;
  activeGame: number;
}

export const BadmintonCourt: React.FC<BadmintonCourtProps> = ({
  config,
  servingSide,
  scoreA,
  scoreB
}) => {
  const isDoubles = config.gameType.includes('doubles');
  
  // In badminton:
  // Serving side score determines right (even) or left (odd) service court
  const currentServerScore = servingSide === 'A' ? scoreA : scoreB;
  const isEvenServer = currentServerScore % 2 === 0;

  // Player names
  const playerA1 = config.sideA.players[0]?.displayName || 'Pemain A';
  const playerA2 = config.sideA.players[1]?.displayName || 'Pemain A2';
  const playerB1 = config.sideB.players[0]?.displayName || 'Pemain B';
  const playerB2 = config.sideB.players[1]?.displayName || 'Pemain B2';

  return (
    <div className="w-full bg-[#1b5e20] p-3 rounded border-2 border-[#2e7d32] shadow-inner select-none">
      {/* Court status bar */}
      <div className="flex items-center justify-between text-[11px] text-emerald-100 font-mono mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: config.sideA.jerseyColor }} />
          <span className="font-bold text-white">{config.sideA.code}</span>
          <span>(Sisi Kiri)</span>
          {servingSide === 'A' && (
            <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded text-[10px]">
              SERVING {isEvenServer ? 'KANAN (GENAP)' : 'KIRI (GANJIL)'}
            </span>
          )}
        </div>

        <span className="text-emerald-300 font-semibold tracking-wider">
          COURT DIAGRAM ({isDoubles ? 'GANDA' : 'TUNGGAL'})
        </span>

        <div className="flex items-center gap-1.5">
          {servingSide === 'B' && (
            <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded text-[10px]">
              SERVING {isEvenServer ? 'KANAN (GENAP)' : 'KIRI (GANJIL)'}
            </span>
          )}
          <span>(Sisi Kanan)</span>
          <span className="font-bold text-white">{config.sideB.code}</span>
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: config.sideB.jerseyColor }} />
        </div>
      </div>

      {/* SVG Court lines */}
      <div className="relative aspect-[2.1/1] w-full bg-[#2e7d32] rounded-xs border-2 border-white overflow-hidden">
        {/* Net line in middle */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1.5 -ml-[3px] bg-white/90 z-20 flex flex-col justify-between py-1">
          <div className="w-full h-full border-r-2 border-dashed border-slate-700/60" />
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-25 bg-amber-300 text-[9px] font-bold text-slate-900 px-1 py-0.5 rounded-b shadow-sm">
          NET
        </div>

        {/* Short service lines (front of court) */}
        {/* Left short service line */}
        <div className="absolute top-0 bottom-0 left-[35%] w-[2px] bg-white/80 z-10" />
        {/* Right short service line */}
        <div className="absolute top-0 bottom-0 right-[35%] w-[2px] bg-white/80 z-10" />

        {/* Center service lines (divides left/right service courts) */}
        {/* Left side center service line */}
        <div className="absolute top-1/2 left-0 right-[65%] h-[2px] -mt-[1px] bg-white/80 z-10" />
        {/* Right side center service line */}
        <div className="absolute top-1/2 left-[65%] right-0 h-[2px] -mt-[1px] bg-white/80 z-10" />

        {/* Singles sidelines (top & bottom inside margins ~ 7%) */}
        <div className="absolute top-[8%] left-0 right-0 h-[2px] bg-white/70" />
        <div className="absolute bottom-[8%] left-0 right-0 h-[2px] bg-white/70" />

        {/* Doubles long service lines (near back line ~ 9%) */}
        <div className="absolute top-0 bottom-0 left-[8%] w-[2px] bg-white/70" />
        <div className="absolute top-0 bottom-0 right-[8%] w-[2px] bg-white/70" />

        {/* Left Side Service Box Highlights */}
        {/* Left Court: Top half is Left Service Court (Odd), Bottom half is Right Service Court (Even) */}
        <div
          className={`absolute top-0 bottom-1/2 left-0 right-[65%] flex items-center justify-center transition-all ${
            servingSide === 'A' && !isEvenServer
              ? 'bg-amber-400/35 border-2 border-amber-300'
              : 'hover:bg-white/5'
          }`}
        >
          <div className="text-center p-1">
            <span className="text-[10px] font-bold text-white drop-shadow-md">
              {isDoubles ? playerA2 : playerA1}
            </span>
            <span className="block text-[8px] text-emerald-200">Kiri (Ganjil)</span>
            {servingSide === 'A' && !isEvenServer && (
              <span className="inline-block px-1.5 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[9px] rounded mt-0.5 animate-pulse">
                🏸 SERVER
              </span>
            )}
          </div>
        </div>

        <div
          className={`absolute top-1/2 bottom-0 left-0 right-[65%] flex items-center justify-center transition-all ${
            servingSide === 'A' && isEvenServer
              ? 'bg-amber-400/35 border-2 border-amber-300'
              : 'hover:bg-white/5'
          }`}
        >
          <div className="text-center p-1">
            <span className="text-[10px] font-bold text-white drop-shadow-md">
              {playerA1}
            </span>
            <span className="block text-[8px] text-emerald-200">Kanan (Genap)</span>
            {servingSide === 'A' && isEvenServer && (
              <span className="inline-block px-1.5 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[9px] rounded mt-0.5 animate-pulse">
                🏸 SERVER
              </span>
            )}
          </div>
        </div>

        {/* Right Side Service Box Highlights */}
        {/* Right Court: Top half is Right Service Court (Even), Bottom half is Left Service Court (Odd) */}
        <div
          className={`absolute top-0 bottom-1/2 left-[65%] right-0 flex items-center justify-center transition-all ${
            servingSide === 'B' && isEvenServer
              ? 'bg-amber-400/35 border-2 border-amber-300'
              : 'hover:bg-white/5'
          }`}
        >
          <div className="text-center p-1">
            <span className="text-[10px] font-bold text-white drop-shadow-md">
              {playerB1}
            </span>
            <span className="block text-[8px] text-emerald-200">Kanan (Genap)</span>
            {servingSide === 'B' && isEvenServer && (
              <span className="inline-block px-1.5 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[9px] rounded mt-0.5 animate-pulse">
                🏸 SERVER
              </span>
            )}
          </div>
        </div>

        <div
          className={`absolute top-1/2 bottom-0 left-[65%] right-0 flex items-center justify-center transition-all ${
            servingSide === 'B' && !isEvenServer
              ? 'bg-amber-400/35 border-2 border-amber-300'
              : 'hover:bg-white/5'
          }`}
        >
          <div className="text-center p-1">
            <span className="text-[10px] font-bold text-white drop-shadow-md">
              {isDoubles ? playerB2 : playerB1}
            </span>
            <span className="block text-[8px] text-emerald-200">Kiri (Ganjil)</span>
            {servingSide === 'B' && !isEvenServer && (
              <span className="inline-block px-1.5 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[9px] rounded mt-0.5 animate-pulse">
                🏸 SERVER
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
