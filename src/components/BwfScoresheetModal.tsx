import React from 'react';
import { MatchFormatConfig, GameScore, RallyPoint } from '../types/badminton';
import { X, Printer, Download, Award, CheckCircle } from 'lucide-react';

interface BwfScoresheetModalProps {
  config: MatchFormatConfig;
  gameScores: GameScore[];
  rallies: RallyPoint[];
  isOpen: boolean;
  onClose: () => void;
}

export const BwfScoresheetModal: React.FC<BwfScoresheetModalProps> = ({
  config,
  gameScores,
  rallies,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const isDoubles = config.gameType.includes('doubles');
  const gamesWonA = gameScores.filter(g => g.completed && g.winner === 'A').length;
  const gamesWonB = gameScores.filter(g => g.completed && g.winner === 'B').length;
  const isMatchComplete = gamesWonA >= 2 || gamesWonB >= 2;
  const matchWinner = gamesWonA > gamesWonB ? config.sideA.name : (gamesWonB > gamesWonA ? config.sideB.name : 'Belum Selesai');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xs shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[95vh] flex flex-col text-slate-800">
        
        {/* Modal Toolbar */}
        <div className="bg-[#263243] text-white px-5 py-3 flex items-center justify-between border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm tracking-wide">
              Lembar Skor Resmi BWF (Official Match Scoresheet)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#07539b] hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Print PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scoresheet Sheet */}
        <div id="printableScoresheet" className="p-8 overflow-y-auto space-y-6 text-xs font-sans print:p-2">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#07539b] uppercase block">
                BADMINTON WORLD FEDERATION / PBSI OFFICIAL SCORESHEET
              </span>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {config.competition}
              </h1>
              <p className="text-slate-600 font-medium">
                {config.venue} · {config.city}, {config.country} · Court {config.court}
              </p>
            </div>
            <div className="text-right border-l-2 border-slate-200 pl-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">NOMOR PERTANDINGAN</span>
              <span className="text-2xl font-black font-mono text-[#07539b]">
                MATCH #{config.matchNumber}
              </span>
              <span className="block text-[11px] font-semibold text-slate-600 uppercase">
                {config.gameType.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Match Info Strip */}
          <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-100 rounded border border-slate-300 text-[11px]">
            <div>
              <span className="text-slate-500 block font-semibold">TANGGAL & WAKTU:</span>
              <span className="font-bold text-slate-800">{new Date(config.date).toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">FORMAT:</span>
              <span className="font-bold text-slate-800">Best of {config.numberOfSets} (Poin {config.pointsPerGame})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">STATUS LAPANGAN:</span>
              <span className="font-bold text-slate-800">{config.neutralVenue ? 'Venue Netral' : 'Home/Away'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">JUMLAH PENONTON:</span>
              <span className="font-bold text-slate-800 tabular-nums">{config.attendance.toLocaleString()} Orang</span>
            </div>
          </div>

          {/* Teams and Players Summary */}
          <div className="grid grid-cols-2 gap-4">
            {/* Side A */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-sm text-[#07539b]">
                  SISI A: {config.sideA.name} ({config.sideA.code})
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 rounded">
                  Pelatih: {config.sideA.coachName || '-'}
                </span>
              </div>
              <div className="space-y-1">
                {config.sideA.players.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {p.name} ({p.displayName})
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      WR: #{p.worldRank || '-'} · {p.handedness === 'Right' ? 'Kanan' : 'Kidal'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side B */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-sm text-[#07539b]">
                  SISI B: {config.sideB.name} ({config.sideB.code})
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 rounded">
                  Pelatih: {config.sideB.coachName || '-'}
                </span>
              </div>
              <div className="space-y-1">
                {config.sideB.players.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {p.name} ({p.displayName})
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      WR: #{p.worldRank || '-'} · {p.handedness === 'Right' ? 'Kanan' : 'Kidal'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scores Matrix per Game */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              HASIL SKOR AKHIR PER GIM (GAMES SCORE SUMMARY)
            </h3>
            <table className="w-full border-collapse border border-slate-400 text-center font-mono">
              <thead>
                <tr className="bg-slate-200 text-slate-800 text-[11px]">
                  <th className="border border-slate-400 p-1.5 text-left font-bold font-sans">TIM / PEMAIN</th>
                  <th className="border border-slate-400 p-1.5 w-20">GIM 1</th>
                  <th className="border border-slate-400 p-1.5 w-20">GIM 2</th>
                  <th className="border border-slate-400 p-1.5 w-20">GIM 3</th>
                  <th className="border border-slate-400 p-1.5 w-24 font-bold bg-slate-300">TOTAL GIM</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr>
                  <td className="border border-slate-400 p-2 text-left font-semibold text-[#07539b]">
                    {config.sideA.name}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[0]?.scoreA ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[1]?.scoreA ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[2]?.scoreA ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-lg font-black bg-blue-50 text-[#07539b] tabular-nums">
                    {gamesWonA}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-left font-semibold text-[#07539b]">
                    {config.sideB.name}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[0]?.scoreB ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[1]?.scoreB ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-base font-bold tabular-nums">
                    {gameScores[2]?.scoreB ?? '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-lg font-black bg-blue-50 text-[#07539b] tabular-nums">
                    {gamesWonB}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Officials Record */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              DAFTAR OFISIAL & WASIT RESMI (MATCH OFFICIALS)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {config.officials.map((off, idx) => (
                <div key={idx} className="p-2 border border-slate-300 rounded bg-slate-50 text-[11px]">
                  <span className="font-bold text-[#07539b] block">{off.role}</span>
                  <span className="font-semibold text-slate-800 block">{off.firstName} {off.lastName}</span>
                  <span className="text-slate-500 text-[10px] block">{off.licenseLevel || 'Nasional'} ({off.federation || 'PBSI'})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-[11px]">
            <div className="space-y-12">
              <span className="font-semibold text-slate-600 uppercase">WASIT UTAMA (UMPIRE)</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-800 block">
                  {config.officials[0]?.firstName} {config.officials[0]?.lastName}
                </span>
                <span className="text-[10px] text-slate-500">Tanda Tangan & Tanggal</span>
              </div>
            </div>

            <div className="space-y-12">
              <span className="font-semibold text-slate-600 uppercase">HAKIM SERVIS (SERVICE JUDGE)</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-800 block">
                  {config.officials[1]?.firstName} {config.officials[1]?.lastName}
                </span>
                <span className="text-[10px] text-slate-500">Tanda Tangan & Tanggal</span>
              </div>
            </div>

            <div className="space-y-12">
              <span className="font-semibold text-slate-600 uppercase">REFEREE TURNAMEN</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-800 block">BWF / PBSI Referee</span>
                <span className="text-[10px] text-slate-500">Persetujuan Hasil Akhir</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
