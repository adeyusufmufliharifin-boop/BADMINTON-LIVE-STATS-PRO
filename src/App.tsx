import React, { useState, useEffect } from 'react';
import { MatchFormatConfig, GameScore } from './types/badminton';
import { defaultMatchConfig, matchPresets } from './data/presets';
import { MatchFormatModal } from './components/MatchFormatModal';
import { LiveScoreConsole } from './components/LiveScoreConsole';
import { BwfScoresheetModal } from './components/BwfScoresheetModal';
import {
  Settings,
  Printer,
  Sparkles,
  Trophy,
  CheckCircle2,
  FileText,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Load config from localStorage if available, or default
  const [matchConfig, setMatchConfig] = useState<MatchFormatConfig>(() => {
    try {
      const saved = localStorage.getItem('badminton_match_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultMatchConfig;
  });

  // Modals state
  // On initial load, open the Match Format Modal directly to show the requested step 1 interface!
  const [isFormatModalOpen, setIsFormatModalOpen] = useState<boolean>(true);
  const [isScoresheetOpen, setIsScoresheetOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage on change
  const handleSaveConfig = (newConfig: MatchFormatConfig) => {
    setMatchConfig(newConfig);
    try {
      localStorage.setItem('badminton_match_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
    setIsFormatModalOpen(false);
    showToast('Format pertandingan berhasil disimpan & dikonfirmasi!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan konfigurasi format pertandingan ke pengaturan awal?')) {
      setMatchConfig(defaultMatchConfig);
      localStorage.removeItem('badminton_match_config');
      showToast('Format dikembalikan ke standar awal.');
    }
  };

  return (
    <div className="min-h-screen bg-[#eaedf1] text-slate-800 flex flex-col font-sans">
      
      {/* Top Application Header */}
      <header className="bg-[#18395f] text-white border-b-2 border-amber-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#07539b] border border-blue-400 flex items-center justify-center text-xl shadow-xs">
              🏸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  BADMINTON LIVE STATS PRO
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded uppercase">
                  Langkah 1: Format Pertandingan
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Sistem Resmi Pencatat Skor, Format Kompetisi, Ofisial & Statistik Live BWF
              </p>
            </div>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFormatModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#07539b] hover:bg-blue-600 text-white font-bold text-xs rounded border border-blue-300 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-amber-300" />
              <span>Buka Format Pertandingan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScoresheetOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-300" />
              <span>Lembar Skor BWF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb & Match Status Banner */}
      <div className="bg-white border-b border-slate-300 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold text-[#07539b]">{matchConfig.competition}</span>
            <span>·</span>
            <span>Venue: <strong className="text-slate-800">{matchConfig.venue}</strong></span>
            <span>·</span>
            <span>Court: <strong className="text-slate-800">{matchConfig.court}</strong></span>
            <span>·</span>
            <span>Format: <strong className="text-slate-800">Best of {matchConfig.numberOfSets} ({matchConfig.pointsPerGame} Poin)</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsFormatModalOpen(true)}
              className="text-[#07539b] hover:underline font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Edit Format / Pemain / Ofisial</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport: Live Stats & Operator Console */}
      <main className="max-w-7xl mx-auto w-full px-4 py-5 flex-1">
        <LiveScoreConsole
          config={matchConfig}
          onOpenFormatModal={() => setIsFormatModalOpen(true)}
          onOpenScoresheet={() => setIsScoresheetOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-300 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>Badminton Live Stats Pro · Modul 1: Konfigurasi Format Pertandingan & Ofisial</span>
          <span className="text-[11px] text-slate-400">
            Sesuai Regulasi Umum Pertandingan Federasi Bulu Tangkis Dunia (BWF Statutes Section 4.1)
          </span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white px-4 py-3 rounded shadow-2xl border-l-4 border-emerald-500 flex items-center gap-2 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Match Format Modal (Langkah Pertama sesuai Gambar & Kode) */}
      <MatchFormatModal
        initialConfig={matchConfig}
        isOpen={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
        onSave={handleSaveConfig}
      />

      {/* Official BWF Scoresheet Modal */}
      <BwfScoresheetModal
        config={matchConfig}
        gameScores={[
          { gameNumber: 1, scoreA: 21, scoreB: 18, completed: true, winner: 'A' },
          { gameNumber: 2, scoreA: 19, scoreB: 21, completed: true, winner: 'B' },
          { gameNumber: 3, scoreA: 14, scoreB: 11, completed: false }
        ]}
        rallies={[]}
        isOpen={isScoresheetOpen}
        onClose={() => setIsScoresheetOpen(false)}
      />

    </div>
  );
}
