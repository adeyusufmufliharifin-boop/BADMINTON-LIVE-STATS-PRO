import React, { useState, useEffect } from 'react';
import { MatchFormatConfig, GameScore, RallyPoint, ShotType } from '../types/badminton';
import { BadmintonCourt } from './BadmintonCourt';
import { TvBroadcastOverlay } from './TvBroadcastOverlay';
import {
  Settings,
  Printer,
  RotateCcw,
  Zap,
  Play,
  Pause,
  AlertTriangle,
  Award,
  Video,
  Clock,
  Tv,
  ArrowRightLeft
} from 'lucide-react';

interface LiveScoreConsoleProps {
  config: MatchFormatConfig;
  onOpenFormatModal: () => void;
  onOpenScoresheet: () => void;
}

export const LiveScoreConsole: React.FC<LiveScoreConsoleProps> = ({
  config,
  onOpenFormatModal,
  onOpenScoresheet
}) => {
  // Active game (1, 2, or 3)
  const [activeGame, setActiveGame] = useState<number>(1);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [servingSide, setServingSide] = useState<'A' | 'B'>('A');
  const [gameScores, setGameScores] = useState<GameScore[]>([
    { gameNumber: 1, scoreA: 0, scoreB: 0, completed: false },
    { gameNumber: 2, scoreA: 0, scoreB: 0, completed: false },
    { gameNumber: 3, scoreA: 0, scoreB: 0, completed: false }
  ]);
  const [rallies, setRallies] = useState<RallyPoint[]>([]);
  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Smash Winner');
  
  // Shuttlecock counter
  const [shuttleCount, setShuttleCount] = useState<number>(2);
  
  // Hawk-eye challenges left
  const [challengesA, setChallengesA] = useState<number>(2);
  const [challengesB, setChallengesB] = useState<number>(2);

  // Interval timer (60s at 11 points)
  const [intervalActive, setIntervalActive] = useState<boolean>(false);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(60);
  const [intervalTriggeredForGame, setIntervalTriggeredForGame] = useState<{ [game: number]: boolean }>({});

  // Broadcast overlay preview toggle
  const [showTvOverlay, setShowTvOverlay] = useState<boolean>(true);

  // Match winner state
  const [matchWinner, setMatchWinner] = useState<'A' | 'B' | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (intervalActive && intervalSeconds > 0) {
      timer = setInterval(() => {
        setIntervalSeconds(s => s - 1);
      }, 1000);
    } else if (intervalSeconds === 0 && intervalActive) {
      setIntervalActive(false);
    }
    return () => clearInterval(timer);
  }, [intervalActive, intervalSeconds]);

  // Check 11-point interval
  const checkInterval = (newA: number, newB: number) => {
    if (config.intervalAt11 && !intervalTriggeredForGame[activeGame]) {
      if (newA === 11 || newB === 11) {
        setIntervalTriggeredForGame(prev => ({ ...prev, [activeGame]: true }));
        setIntervalSeconds(config.miscConfig.interval11DurationSec || 60);
        setIntervalActive(true);
      }
    }
  };

  // Check game win
  const checkGameWin = (newA: number, newB: number) => {
    const targetPoints = activeGame === 3 ? config.pointsDecidingGame : config.pointsPerGame;
    const cap = config.capPoint || 30;

    let wonBy: 'A' | 'B' | null = null;

    if (newA >= targetPoints || newB >= targetPoints) {
      if (newA >= cap) {
        wonBy = 'A';
      } else if (newB >= cap) {
        wonBy = 'B';
      } else if (Math.abs(newA - newB) >= 2) {
        wonBy = newA > newB ? 'A' : 'B';
      }
    }

    if (wonBy) {
      // Mark game as complete
      const updatedGames = [...gameScores];
      updatedGames[activeGame - 1] = {
        gameNumber: activeGame,
        scoreA: newA,
        scoreB: newB,
        completed: true,
        winner: wonBy
      };
      setGameScores(updatedGames);

      // Check match victory (best of 3: first to 2 games)
      const gamesWonA = updatedGames.filter(g => g.completed && g.winner === 'A').length;
      const gamesWonB = updatedGames.filter(g => g.completed && g.winner === 'B').length;

      if (gamesWonA >= 2) {
        setMatchWinner('A');
      } else if (gamesWonB >= 2) {
        setMatchWinner('B');
      } else if (activeGame < config.numberOfSets) {
        // Move to next game!
        setActiveGame(activeGame + 1);
        setScoreA(0);
        setScoreB(0);
        setServingSide(wonBy); // Winner serves first in next game
        setChallengesA(config.miscConfig.videoChallengesPerGame || 2);
        setChallengesB(config.miscConfig.videoChallengesPerGame || 2);
      }
    }
  };

  // Add Point
  const handleAddPoint = (side: 'A' | 'B') => {
    if (matchWinner) return;

    const newA = side === 'A' ? scoreA + 1 : scoreA;
    const newB = side === 'B' ? scoreB + 1 : scoreB;

    const newRally: RallyPoint = {
      id: `r-${Date.now()}`,
      gameNumber: activeGame,
      rallyNumber: rallies.length + 1,
      servingSide: servingSide,
      winnerSide: side,
      scoreSideA: newA,
      scoreSideB: newB,
      shotType: selectedShotType,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    setRallies([newRally, ...rallies]);
    setScoreA(newA);
    setScoreB(newB);
    setServingSide(side); // Point winner takes/keeps service in rally point system

    checkInterval(newA, newB);
    checkGameWin(newA, newB);
  };

  // Undo Last Point
  const handleUndo = () => {
    if (rallies.length === 0) return;
    const lastRally = rallies[0];
    const remaining = rallies.slice(1);
    setRallies(remaining);

    if (remaining.length > 0) {
      setScoreA(remaining[0].scoreSideA);
      setScoreB(remaining[0].scoreSideB);
      setServingSide(remaining[0].winnerSide);
    } else {
      setScoreA(0);
      setScoreB(0);
      setServingSide('A');
    }
    setMatchWinner(null);
  };

  // Challenge use
  const handleUseChallenge = (side: 'A' | 'B') => {
    if (side === 'A' && challengesA > 0) setChallengesA(c => c - 1);
    if (side === 'B' && challengesB > 0) setChallengesB(c => c - 1);
  };

  // Stats calculation
  const totalRallies = rallies.length;
  const smashesA = rallies.filter(r => r.winnerSide === 'A' && r.shotType === 'Smash Winner').length;
  const smashesB = rallies.filter(r => r.winnerSide === 'B' && r.shotType === 'Smash Winner').length;
  const errorsA = rallies.filter(r => r.winnerSide === 'B' && r.shotType.includes('Error')).length;
  const errorsB = rallies.filter(r => r.winnerSide === 'A' && r.shotType.includes('Error')).length;

  const isDoubles = config.gameType.includes('doubles');
  const playerAName = isDoubles
    ? `${config.sideA.players[0]?.displayName || 'A1'} / ${config.sideA.players[1]?.displayName || 'A2'}`
    : config.sideA.players[0]?.displayName || config.sideA.name;
  const playerBName = isDoubles
    ? `${config.sideB.players[0]?.displayName || 'B1'} / ${config.sideB.players[1]?.displayName || 'B2'}`
    : config.sideB.players[0]?.displayName || config.sideB.name;

  return (
    <div className="space-y-4">
      {/* Top Console Navigation Bar */}
      <div className="bg-[#18395f] text-white px-4 py-2.5 rounded-sm shadow-md flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#07539b] border border-blue-300 flex items-center justify-center font-black text-amber-400 text-sm">
            🏸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">{config.competition}</span>
              <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded font-mono">
                Court {config.court}
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded">
                MATCH #{config.matchNumber}
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              {config.venue} · {config.city}, {config.country} · {config.gameType.replace('-', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Console Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTvOverlay(!showTvOverlay)}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showTvOverlay ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Overlay TV</span>
          </button>

          <button
            type="button"
            onClick={onOpenScoresheet}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded flex items-center gap-1.5 border border-slate-600 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-300" />
            <span>Lembar Skor BWF</span>
          </button>

          <button
            type="button"
            onClick={onOpenFormatModal}
            className="px-3.5 py-1.5 bg-[#07539b] hover:bg-[#0b64b8] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs border border-blue-400/40 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span>Format Pertandingan</span>
          </button>
        </div>
      </div>

      {/* Interval 11 Points Banner Notification */}
      {intervalActive && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 font-bold" />
            <div>
              <span className="font-extrabold text-sm uppercase">INTERVAL 60 DETIK (SKOR 11 POIN TERCAPAI)</span>
              <p className="text-xs font-medium text-slate-900">
                Pemain diperbolehkan istirahat & berkonsultasi dengan pelatih di pinggir lapangan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-mono tabular-nums bg-slate-950 text-amber-400 px-3 py-1 rounded">
              {intervalSeconds}s
            </span>
            <button
              type="button"
              onClick={() => setIntervalActive(false)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-950 text-white rounded hover:bg-slate-800"
            >
              Lanjutkan Pertandingan
            </button>
          </div>
        </div>
      )}

      {/* Match Winner Alert */}
      {matchWinner && (
        <div className="bg-emerald-600 text-white p-4 rounded shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-300" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                PERTANDINGAN SELESAI · PEMENANG:
              </span>
              <h2 className="text-xl font-black">
                {matchWinner === 'A' ? config.sideA.name : config.sideB.name} MENANG!
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenScoresheet}
            className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded hover:bg-emerald-50 shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Lihat & Cetak Lembar Skor Resmi
          </button>
        </div>
      )}

      {/* TV Broadcast Graphic Preview */}
      {showTvOverlay && (
        <TvBroadcastOverlay
          config={config}
          gameScores={gameScores}
          activeGame={activeGame}
          currentScoreA={scoreA}
          currentScoreB={scoreB}
          servingSide={servingSide}
        />
      )}

      {/* Main Scoring Cockpit & Court Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Live Scoring Box (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Scoreboard Display */}
          <div className="bg-white rounded border border-slate-300 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#07539b]">
                  GIM KE-{activeGame} DARI {config.numberOfSets}
                </span>
                <span className="text-[11px] text-slate-500">
                  (Target: {activeGame === 3 ? config.pointsDecidingGame : config.pointsPerGame} poin · Cap: {config.capPoint})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={rallies.length === 0}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                  title="Batalkan poin terakhir"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              </div>
            </div>

            {/* Scoreboard Dual Cards */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* SISI A BOX */}
              <div
                className={`p-4 rounded-xs border-2 transition-all ${
                  servingSide === 'A'
                    ? 'border-[#07539b] bg-blue-50/40 shadow-sm'
                    : 'border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: config.sideA.jerseyColor }} />
                    {config.sideA.code}
                  </span>
                  {servingSide === 'A' && (
                    <span className="text-[10px] font-bold bg-[#07539b] text-white px-2 py-0.5 rounded">
                      SERVING 🏸
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-sm truncate" title={playerAName}>
                  {playerAName}
                </div>

                {/* Big Score Display */}
                <div className="my-3 text-center">
                  <span className="text-5xl font-black font-mono text-[#07539b] tabular-nums tracking-tight">
                    {scoreA}
                  </span>
                </div>

                {/* Scoring Buttons */}
                <button
                  type="button"
                  disabled={!!matchWinner}
                  onClick={() => handleAddPoint('A')}
                  className="w-full py-2.5 bg-[#07539b] hover:bg-[#06427d] disabled:opacity-40 text-white font-bold text-sm rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>+1 Poin {config.sideA.code}</span>
                </button>

                {/* Challenges Quota */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Challenge Hawk-Eye:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(config.miscConfig.videoChallengesPerGame || 2)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                          i < challengesA
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-slate-200 border-slate-300 text-slate-400'
                        }`}
                      >
                        ✓
                      </span>
                    ))}
                    <button
                      type="button"
                      disabled={challengesA <= 0}
                      onClick={() => handleUseChallenge('A')}
                      className="ml-1 text-[10px] text-slate-600 hover:text-rose-600 disabled:opacity-20"
                    >
                      Pakai
                    </button>
                  </div>
                </div>
              </div>

              {/* SISI B BOX */}
              <div
                className={`p-4 rounded-xs border-2 transition-all ${
                  servingSide === 'B'
                    ? 'border-[#07539b] bg-blue-50/40 shadow-sm'
                    : 'border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: config.sideB.jerseyColor }} />
                    {config.sideB.code}
                  </span>
                  {servingSide === 'B' && (
                    <span className="text-[10px] font-bold bg-[#07539b] text-white px-2 py-0.5 rounded">
                      SERVING 🏸
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-sm truncate" title={playerBName}>
                  {playerBName}
                </div>

                {/* Big Score Display */}
                <div className="my-3 text-center">
                  <span className="text-5xl font-black font-mono text-[#07539b] tabular-nums tracking-tight">
                    {scoreB}
                  </span>
                </div>

                {/* Scoring Buttons */}
                <button
                  type="button"
                  disabled={!!matchWinner}
                  onClick={() => handleAddPoint('B')}
                  className="w-full py-2.5 bg-[#07539b] hover:bg-[#06427d] disabled:opacity-40 text-white font-bold text-sm rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>+1 Poin {config.sideB.code}</span>
                </button>

                {/* Challenges Quota */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Challenge Hawk-Eye:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(config.miscConfig.videoChallengesPerGame || 2)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                          i < challengesB
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-slate-200 border-slate-300 text-slate-400'
                        }`}
                      >
                        ✓
                      </span>
                    ))}
                    <button
                      type="button"
                      disabled={challengesB <= 0}
                      onClick={() => handleUseChallenge('B')}
                      className="ml-1 text-[10px] text-slate-600 hover:text-rose-600 disabled:opacity-20"
                    >
                      Pakai
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Shot Type Classification Selector */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Tipe Pukulan Penentu Rally Berikutnya:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Smash Winner',
                  'Drop Shot',
                  'Net Kill',
                  'Drive Winner',
                  'Clear/Lob',
                  'Opponent Error Net',
                  'Opponent Error Out',
                  'Service Ace',
                  'Service Fault'
                ].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedShotType(type as ShotType)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      selectedShotType === type
                        ? 'bg-[#07539b] text-white font-bold border-[#07539b]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Shuttlecock & Match Utilities */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Kok Dipakai (Shuttlecocks):</span>
                <span className="font-bold text-slate-900 font-mono px-2 py-0.5 bg-slate-100 rounded">
                  {shuttleCount} Kok
                </span>
                <button
                  type="button"
                  onClick={() => setShuttleCount(c => c + 1)}
                  className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px]"
                >
                  + Ganti Kok
                </button>
              </div>

              <div className="text-right text-[11px] text-slate-500">
                Wasit Utama: <strong className="text-slate-800">{config.officials[0]?.firstName} {config.officials[0]?.lastName}</strong>
              </div>
            </div>

          </div>

          {/* Interactive Badminton Court Diagram */}
          <BadmintonCourt
            config={config}
            servingSide={servingSide}
            scoreA={scoreA}
            scoreB={scoreB}
            activeGame={activeGame}
          />
        </div>

        {/* Right Column: Live Match Statistics & Point History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Match Statistics Card */}
          <div className="bg-white rounded border border-slate-300 shadow-xs p-4">
            <h3 className="font-bold text-xs uppercase text-[#07539b] tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>STATISTIK PERTANDINGAN LANGSUNG</span>
              <span className="text-[11px] font-mono text-slate-500">{totalRallies} Total Rally</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Total Points */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{scoreA}</span>
                  <span className="text-slate-500 font-normal">Total Poin Gim {activeGame}</span>
                  <span>{scoreB}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="h-full bg-[#07539b]"
                    style={{ width: `${totalRallies > 0 ? (scoreA / (scoreA + scoreB || 1)) * 100 : 50}%` }}
                  />
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${totalRallies > 0 ? (scoreB / (scoreA + scoreB || 1)) * 100 : 50}%` }}
                  />
                </div>
              </div>

              {/* Smash Winners */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{smashesA}</span>
                  <span className="text-slate-500 font-normal">Smash Winners</span>
                  <span>{smashesB}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="h-full bg-[#07539b]"
                    style={{ width: `${(smashesA + smashesB) > 0 ? (smashesA / (smashesA + smashesB)) * 100 : 50}%` }}
                  />
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(smashesA + smashesB) > 0 ? (smashesB / (smashesA + smashesB)) * 100 : 50}%` }}
                  />
                </div>
              </div>

              {/* Unforced Errors */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{errorsA}</span>
                  <span className="text-slate-500 font-normal">Unforced Errors</span>
                  <span>{errorsB}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${(errorsA + errorsB) > 0 ? (errorsA / (errorsA + errorsB)) * 100 : 50}%` }}
                  />
                  <div
                    className="h-full bg-rose-400"
                    style={{ width: `${(errorsA + errorsB) > 0 ? (errorsB / (errorsA + errorsB)) * 100 : 50}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Officials Summary */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Hakim Servis:</span>
                <span className="font-semibold text-slate-700">{config.officials[1]?.firstName} {config.officials[1]?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span>Hakim Garis 1:</span>
                <span className="font-semibold text-slate-700">{config.officials[2]?.firstName} {config.officials[2]?.lastName}</span>
              </div>
            </div>
          </div>

          {/* Point-by-Point Rally History Log */}
          <div className="bg-white rounded border border-slate-300 shadow-xs p-4 flex flex-col h-[290px]">
            <h3 className="font-bold text-xs uppercase text-[#07539b] tracking-wider mb-2 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>RIWAYAT RALLY (POINT LOG)</span>
              <span className="text-[10px] text-slate-400 font-normal">Urutan Terbaru</span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {rallies.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                  <span>Belum ada poin tercatat pada gim ini.</span>
                  <span className="text-[11px] text-slate-400 mt-1">Klik tombol "+1 Poin" di atas untuk mencatat.</span>
                </div>
              ) : (
                rallies.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-6">#{r.rallyNumber}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          r.winnerSide === 'A' ? 'bg-blue-100 text-[#07539b]' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        Poin: {r.winnerSide === 'A' ? config.sideA.code : config.sideB.code}
                      </span>
                      <span className="text-[11px] font-sans text-slate-600 truncate max-w-[130px]">
                        {r.shotType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 tabular-nums">
                        {r.scoreSideA} - {r.scoreSideB}
                      </span>
                      <span className="text-[10px] text-slate-400">{r.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
