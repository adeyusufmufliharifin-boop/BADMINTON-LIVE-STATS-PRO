import React, { useState } from 'react';
import { MatchFormatConfig, GameType, Official } from '../types/badminton';
import { OfficialMoreModal } from './OfficialMoreModal';
import {
  X,
  Check,
  Plus,
  Trash2,
  Users,
  Info,
  Printer,
  Sliders,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
  UserCheck
} from 'lucide-react';
import { matchPresets } from '../data/presets';

interface MatchFormatModalProps {
  initialConfig: MatchFormatConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: MatchFormatConfig) => void;
}

type TabKey = 'info' | 'officials' | 'teams' | 'players' | 'print' | 'misc';

export const MatchFormatModal: React.FC<MatchFormatModalProps> = ({
  initialConfig,
  isOpen,
  onClose,
  onSave
}) => {
  const [config, setConfig] = useState<MatchFormatConfig>({ ...initialConfig });
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [editingOfficialIndex, setEditingOfficialIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<'id' | 'en'>('id');

  if (!isOpen) return null;

  const isDoubles = config.gameType.includes('doubles');

  const handleOfficialChange = (index: number, field: keyof Official, value: string) => {
    const updated = [...config.officials];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, officials: updated });
  };

  const handleAddOfficial = () => {
    const newOfficial: Official = {
      id: `off-${Date.now()}`,
      firstName: '',
      lastName: '',
      role: 'Hakim Garis 1 (Line Judge)',
      licenseLevel: 'Nasional',
      federation: 'PBSI'
    };
    setConfig({ ...config, officials: [...config.officials, newOfficial] });
  };

  const handleRemoveOfficial = (index: number) => {
    if (config.officials.length <= 1) return;
    const updated = config.officials.filter((_, i) => i !== index);
    setConfig({ ...config, officials: updated });
  };

  const handleSaveOfficialDetail = (updated: Official) => {
    if (editingOfficialIndex === null) return;
    const list = [...config.officials];
    list[editingOfficialIndex] = updated;
    setConfig({ ...config, officials: list });
  };

  const handleGameTypeChange = (newType: GameType) => {
    const isNowDoubles = newType.includes('doubles');
    const wasDoubles = config.gameType.includes('doubles');

    let newSideA = { ...config.sideA };
    let newSideB = { ...config.sideB };

    if (isNowDoubles && !wasDoubles) {
      if (newSideA.players.length < 2) {
        newSideA.players = [
          newSideA.players[0] || {
            id: 'p-a-1',
            name: 'Pemain 1 Sisi A',
            displayName: 'Pemain 1',
            handedness: 'Right',
            countryOrClub: config.sideA.name
          },
          {
            id: 'p-a-2',
            name: 'Pemain 2 Sisi A',
            displayName: 'Pemain 2',
            handedness: 'Right',
            countryOrClub: config.sideA.name
          }
        ];
      }
      if (newSideB.players.length < 2) {
        newSideB.players = [
          newSideB.players[0] || {
            id: 'p-b-1',
            name: 'Pemain 1 Sisi B',
            displayName: 'Pemain 1',
            handedness: 'Right',
            countryOrClub: config.sideB.name
          },
          {
            id: 'p-b-2',
            name: 'Pemain 2 Sisi B',
            displayName: 'Pemain 2',
            handedness: 'Right',
            countryOrClub: config.sideB.name
          }
        ];
      }
    } else if (!isNowDoubles && wasDoubles) {
      newSideA.players = [newSideA.players[0]];
      newSideB.players = [newSideB.players[0]];
    }

    setConfig({
      ...config,
      gameType: newType,
      sideA: newSideA,
      sideB: newSideB
    });
  };

  const handleApplyPreset = (presetIndex: number) => {
    const preset = matchPresets[presetIndex];
    if (preset && preset.config) {
      setConfig({
        ...config,
        ...preset.config
      } as MatchFormatConfig);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(config);
  };

  // Reusable Officials Block so it can be rendered side-by-side or in tab
  const renderOfficialsBlock = (isCompact = true) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <h2 className="text-[13px] font-bold text-[#07539b] tracking-wider uppercase flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-[#07539b]" />
          <span>{lang === 'id' ? 'OFISIAL PERTANDINGAN (OFFICIALS)' : 'OFFICIALS'}</span>
        </h2>
        <button
          type="button"
          onClick={handleAddOfficial}
          className="px-2.5 py-1 text-[11px] font-semibold text-[#07539b] hover:bg-blue-50 border border-[#07539b]/40 rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          {lang === 'id' ? 'Tambah Ofisial' : 'Add Official'}
        </button>
      </div>

      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5">
        {config.officials.map((official, idx) => (
          <div
            key={official.id || idx}
            className="grid grid-cols-[1.1fr_1.1fr_1.8fr_auto_auto] items-center gap-1.5 p-1.5 bg-[#f8fafc] border border-slate-300 rounded-xs hover:border-slate-400 transition-colors"
          >
            {/* NAME */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                {lang === 'id' ? 'NAMA DEPAN' : 'NAME'}
              </label>
              <input
                type="text"
                placeholder="Nama Depan"
                value={official.firstName}
                onChange={e => handleOfficialChange(idx, 'firstName', e.target.value)}
                className="w-full h-7 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] focus:ring-1 focus:ring-[#07539b] outline-hidden"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                {lang === 'id' ? 'NAMA BELAKANG' : 'LAST NAME'}
              </label>
              <input
                type="text"
                placeholder="Nama Belakang"
                value={official.lastName}
                onChange={e => handleOfficialChange(idx, 'lastName', e.target.value)}
                className="w-full h-7 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] focus:ring-1 focus:ring-[#07539b] outline-hidden"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                {lang === 'id' ? 'PERAN' : 'ROLE'}
              </label>
              <select
                value={official.role}
                onChange={e => handleOfficialChange(idx, 'role', e.target.value as any)}
                className="w-full h-7 px-1.5 border border-slate-300 rounded-xs bg-white text-[11px] focus:border-[#07539b] outline-hidden truncate"
              >
                <option value="Wasit Utama (Umpire)">Wasit Utama (Umpire)</option>
                <option value="Hakim Servis (Service Judge)">Hakim Servis (Service Judge)</option>
                <option value="Hakim Garis 1 (Line Judge)">Hakim Garis 1 (Line Judge)</option>
                <option value="Hakim Garis 2 (Line Judge)">Hakim Garis 2 (Line Judge)</option>
                <option value="Referee Turnamen">Referee Turnamen</option>
              </select>
            </div>

            {/* MORE BUTTON */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setEditingOfficialIndex(idx)}
                className="h-7 px-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-semibold rounded-xs border border-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Detail lisensi & catatan ofisial"
              >
                <Users className="w-3 h-3 text-slate-700" />
                <span>More</span>
              </button>
            </div>

            {/* REMOVE BUTTON */}
            <div className="pt-3">
              <button
                type="button"
                disabled={config.officials.length <= 1}
                onClick={() => handleRemoveOfficial(idx)}
                className="h-7 px-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition-colors cursor-pointer"
                title="Hapus baris ofisial"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 md:p-3 overflow-y-auto">
      <div className="bg-white w-full max-w-[1240px] max-h-[96vh] rounded-xs shadow-2xl border border-slate-300 flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        
        {/* Top Preset Bar */}
        <div className="bg-[#1e293b] text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'id' ? 'Template Format Cepat:' : 'Quick Presets:'}
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {matchPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-colors cursor-pointer"
                >
                  {preset.label.split(':')[0]}: {preset.label.split(':')[1]?.slice(0, 24)}...
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-slate-400">Bahasa:</span>
            <button
              type="button"
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
            >
              {lang === 'id' ? 'English' : 'Bahasa Indonesia'}
            </button>
          </div>
        </div>

        {/* TOPBAR NAVIGATION - Strictly matching tournament software */}
        <nav
          className="flex items-stretch bg-[#d3d3d3] border-b border-[#a0a5aa] select-none text-[13px] font-sans shrink-0 overflow-x-auto"
          aria-label="Navigasi form"
        >
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'info'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <Info className="w-4 h-4" />
            {lang === 'id' ? 'Informasi Pertandingan & Format' : 'Game Info & Format'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('officials')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'officials'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            {lang === 'id' ? 'Ofisial Pertandingan' : 'Officials'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'teams'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <Layers className="w-4 h-4" />
            {lang === 'id' ? 'Tim' : 'Teams'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('players')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'players'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <Users className="w-4 h-4" />
            {lang === 'id' ? 'Pemain' : 'Players'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('print')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'print'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <Printer className="w-4 h-4" />
            {lang === 'id' ? 'Pengaturan Cetak' : 'Print Settings'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('misc')}
            className={`px-4 py-3 border-r border-[#b5b9be] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'misc'
                ? 'bg-[#07539b] text-white font-bold'
                : 'bg-transparent text-[#222] hover:bg-[#e2e5e8]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            {lang === 'id' ? 'Konfigurasi Lain' : 'Misc Config'}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Top Discard & Close button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-[#4b5563] hover:bg-[#374151] text-white flex items-center gap-1 border-l border-[#6b7280] transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0"
          >
            <span>{lang === 'id' ? 'Batal & Tutup' : 'Discard & Close'}</span>
            <X className="w-4 h-4" />
          </button>

          {/* Top Save & Confirm button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-4 py-3 bg-[#263243] hover:bg-[#1a2330] text-white flex items-center gap-1.5 transition-colors cursor-pointer font-semibold whitespace-nowrap shrink-0"
          >
            <span>{lang === 'id' ? 'Simpan & Konfirmasi' : 'Save & Confirm'}</span>
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          </button>
        </nav>

        {/* MAIN BODY AREA - High Density, Zero-Scroll Layout */}
        <div className="p-4 md:p-5 overflow-y-auto flex-1 bg-white text-[#333]">
          
          {/* Header Title inside Content - Compact */}
          <div className="text-center mb-3">
            <h1 className="text-[15px] font-bold text-[#07539b] tracking-tight">
              {lang === 'id'
                ? 'Mulai Pertandingan Baru dengan mengisi semua informasi di bawah ini'
                : 'Start a New Game by entering all the informations below'}
            </h1>
            <p className="text-[11px] text-slate-500">
              <span className="text-[#c62828] font-bold">*</span>{' '}
              {lang === 'id' ? 'Menandakan kolom wajib diisi · Semua kolom dapat diisi langsung tanpa perlu scroll' : 'Denotes mandatory fields · Zero scroll layout'}
            </p>
          </div>

          <form id="matchConfigForm" onSubmit={handleSubmit} className="space-y-4">
            
            {/* ================= TAB 1: INFORMASI PERTANDINGAN (SIDE-BY-SIDE WITH OFFICIALS) ================= */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4 items-start">
                
                {/* LEFT COLUMN: Match Location & Rules (7 cols) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="p-3 bg-[#f8fafc] border border-slate-300 rounded-xs space-y-2">
                    <span className="text-[11px] font-bold text-[#07539b] uppercase tracking-wider block border-b border-slate-200 pb-1">
                      1. DETAIL KOMPETISI & LOKASI
                    </span>

                    {/* Game Number & Competition */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label htmlFor="gameNumber" className="text-right text-[12px] font-medium text-slate-700">
                        {lang === 'id' ? 'Nomor Match' : 'Game Number'}
                      </label>
                      <input
                        id="gameNumber"
                        type="text"
                        value={config.matchNumber}
                        onChange={e => setConfig({ ...config, matchNumber: e.target.value })}
                        className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label htmlFor="competition" className="text-right text-[12px] font-medium text-slate-700">
                        <span className="text-[#c62828] font-bold">*</span>{' '}
                        {lang === 'id' ? 'Kompetisi' : 'Competition'}
                      </label>
                      <input
                        id="competition"
                        type="text"
                        required
                        value={config.competition}
                        onChange={e => setConfig({ ...config, competition: e.target.value })}
                        className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden font-semibold text-[#07539b]"
                      />
                    </div>

                    {/* Date & Attendance */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label htmlFor="matchDate" className="text-right text-[12px] font-medium text-slate-700">
                        <span className="text-[#c62828] font-bold">*</span>{' '}
                        {lang === 'id' ? 'Tanggal' : 'Date'}
                      </label>
                      <div className="grid grid-cols-[1.5fr_auto_1fr] items-center gap-1.5">
                        <input
                          id="matchDate"
                          type="datetime-local"
                          required
                          value={config.date}
                          onChange={e => setConfig({ ...config, date: e.target.value })}
                          className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[11px] focus:border-[#07539b] outline-hidden"
                        />
                        <span className="text-[11px] text-slate-500 font-medium">Penonton:</span>
                        <input
                          id="attendance"
                          type="number"
                          min="0"
                          value={config.attendance}
                          onChange={e => setConfig({ ...config, attendance: parseInt(e.target.value) || 0 })}
                          className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Venue & Court */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label htmlFor="venue" className="text-right text-[12px] font-medium text-slate-700">
                        Venue & Court
                      </label>
                      <div className="grid grid-cols-[1.6fr_auto_1fr] items-center gap-1.5">
                        <input
                          id="venue"
                          type="text"
                          value={config.venue}
                          onChange={e => setConfig({ ...config, venue: e.target.value })}
                          placeholder="Nama Stadion / GOR"
                          className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden"
                        />
                        <span className="text-[11px] text-slate-500 font-medium">Court:</span>
                        <input
                          id="court"
                          type="text"
                          value={config.court}
                          onChange={e => setConfig({ ...config, court: e.target.value })}
                          placeholder="1"
                          className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden"
                        />
                      </div>
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label htmlFor="city" className="text-right text-[12px] font-medium text-slate-700">
                        Kota & Negara
                      </label>
                      <div className="grid grid-cols-[1.4fr_1fr] items-center gap-1.5">
                        <input
                          id="city"
                          type="text"
                          value={config.city}
                          onChange={e => setConfig({ ...config, city: e.target.value })}
                          placeholder="Kota / Provinsi"
                          className="w-full h-8 px-2 border border-slate-300 rounded-xs bg-white text-[12px] focus:border-[#07539b] outline-hidden"
                        />
                        <select
                          id="country"
                          value={config.country}
                          onChange={e => setConfig({ ...config, country: e.target.value })}
                          className="w-full h-8 px-1.5 border border-slate-300 rounded-xs bg-white text-[11px] focus:border-[#07539b] outline-hidden"
                        >
                          <option value="Indonesia">Indonesia</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="China">China</option>
                          <option value="Japan">Japan</option>
                          <option value="Denmark">Denmark</option>
                          <option value="South Korea">South Korea</option>
                          <option value="Thailand">Thailand</option>
                          <option value="India">India</option>
                          <option value="England">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Format & Game Type Box */}
                  <div className="p-3 bg-[#f8fafc] border border-slate-300 rounded-xs space-y-2">
                    <span className="text-[11px] font-bold text-[#07539b] uppercase tracking-wider block border-b border-slate-200 pb-1">
                      2. FORMAT PERTANDINGAN & POIN (BWF RULES)
                    </span>

                    {/* Game Type Buttons */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label className="text-right text-[12px] font-medium text-slate-700">
                        <span className="text-[#c62828] font-bold">*</span> Jenis Match
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'men-singles', label: 'Tunggal Putra (MS)' },
                          { id: 'women-singles', label: 'Tunggal Putri (WS)' },
                          { id: 'men-doubles', label: 'Ganda Putra (MD)' },
                          { id: 'women-doubles', label: 'Ganda Putri (WD)' },
                          { id: 'mixed-doubles', label: 'Ganda Campuran (XD)' }
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleGameTypeChange(t.id as GameType)}
                            className={`px-2 py-1 rounded-xs text-[11px] transition-colors cursor-pointer border ${
                              config.gameType === t.id
                                ? 'bg-[#07539b] text-white font-bold border-[#07539b]'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sets & Points inline */}
                    <div className="grid grid-cols-[115px_1fr] items-center gap-2">
                      <label className="text-right text-[12px] font-medium text-slate-700">
                        Format Gim
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Jumlah Gim</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={config.numberOfSets}
                            onChange={e => setConfig({ ...config, numberOfSets: parseInt(e.target.value) || 3 })}
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs font-semibold tabular-nums text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Poin Gim 1-2</span>
                          <input
                            type="number"
                            min="11"
                            max="30"
                            value={config.pointsPerGame}
                            onChange={e => setConfig({ ...config, pointsPerGame: parseInt(e.target.value) || 21 })}
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs font-semibold tabular-nums text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Cap Poin (Deuce)</span>
                          <input
                            type="number"
                            min="21"
                            max="35"
                            value={config.capPoint}
                            onChange={e => setConfig({ ...config, capPoint: parseInt(e.target.value) || 30 })}
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs font-semibold tabular-nums text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes inline */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-200 text-[11px] text-slate-700 pl-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.conferenceGame}
                          onChange={e => setConfig({ ...config, conferenceGame: e.target.checked })}
                          className="w-3.5 h-3.5 rounded-xs text-[#07539b]"
                        />
                        <span>Turnamen Resmi BWF</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.neutralVenue}
                          onChange={e => setConfig({ ...config, neutralVenue: e.target.checked })}
                          className="w-3.5 h-3.5 rounded-xs text-[#07539b]"
                        />
                        <span>Venue Netral</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.intervalAt11}
                          onChange={e => setConfig({ ...config, intervalAt11: e.target.checked })}
                          className="w-3.5 h-3.5 rounded-xs text-[#07539b]"
                        />
                        <span>Interval 60s di Skor 11</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: OFFICIALS RIGHT AT THE TOP (5 cols) - ZERO SCROLL! */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="p-3 bg-[#f0f4f9] border-2 border-[#07539b]/30 rounded-xs shadow-xs">
                    {renderOfficialsBlock(true)}
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-[#07539b] block">💡 Catatan Alur Input:</span>
                    <p>
                      Posisi ofisial sekarang langsung terlihat di sebelah kanan atas tanpa perlu scroll! Setelah selesai, Anda dapat langsung menekan tombol <strong>Simpan & Konfirmasi</strong> di pojok kanan atas atau bawah.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 2: DEDICATED OFFICIALS TAB (JIKA INGIN FOKUS PADA OFISIAL) ================= */}
            {activeTab === 'officials' && (
              <div className="max-w-4xl mx-auto p-4 border border-slate-300 rounded bg-[#f8fafc] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <div>
                    <h2 className="text-base font-bold text-[#07539b]">
                      Kelola Ofisial Pertandingan Lengkap
                    </h2>
                    <p className="text-xs text-slate-500">
                      Masukkan nama wasit, hakim servis, dan hakim garis beserta detail akreditasi BWF/PBSI.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOfficial}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#07539b] hover:bg-[#06427d] rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Ofisial Baru
                  </button>
                </div>

                <div className="space-y-2.5">
                  {config.officials.map((official, idx) => (
                    <div
                      key={official.id || idx}
                      className="grid grid-cols-[1.5fr_1.5fr_2fr_auto_auto] items-center gap-3 p-3 bg-white border border-slate-300 rounded shadow-xs"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">NAMA DEPAN</label>
                        <input
                          type="text"
                          value={official.firstName}
                          onChange={e => handleOfficialChange(idx, 'firstName', e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">NAMA BELAKANG</label>
                        <input
                          type="text"
                          value={official.lastName}
                          onChange={e => handleOfficialChange(idx, 'lastName', e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">PERAN RESMI</label>
                        <select
                          value={official.role}
                          onChange={e => handleOfficialChange(idx, 'role', e.target.value as any)}
                          className="w-full h-8 px-2 border border-slate-300 rounded text-xs"
                        >
                          <option value="Wasit Utama (Umpire)">Wasit Utama (Umpire)</option>
                          <option value="Hakim Servis (Service Judge)">Hakim Servis (Service Judge)</option>
                          <option value="Hakim Garis 1 (Line Judge)">Hakim Garis 1 (Line Judge)</option>
                          <option value="Hakim Garis 2 (Line Judge)">Hakim Garis 2 (Line Judge)</option>
                          <option value="Referee Turnamen">Referee Turnamen (Tournament Referee)</option>
                        </select>
                      </div>
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setEditingOfficialIndex(idx)}
                          className="h-8 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded border border-slate-400 flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>More</span>
                        </button>
                      </div>
                      <div className="pt-4">
                        <button
                          type="button"
                          disabled={config.officials.length <= 1}
                          onClick={() => handleRemoveOfficial(idx)}
                          className="h-8 px-2 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: TIM (TEAMS) ================= */}
            {activeTab === 'teams' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SISI A */}
                  <div className="p-4 border border-slate-300 rounded-xs bg-[#f8fafc] space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-xs text-[#07539b] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: config.sideA.jerseyColor }} />
                        SISI A (Lapangan Kiri Awal)
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 rounded">
                        {config.sideA.code || 'INA'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Nama Tim / Negara</label>
                        <input
                          type="text"
                          value={config.sideA.name}
                          onChange={e => setConfig({
                            ...config,
                            sideA: { ...config.sideA, name: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-0.5">Kode Singkatan</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={config.sideA.code}
                            onChange={e => setConfig({
                              ...config,
                              sideA: { ...config.sideA, code: e.target.value.toUpperCase() }
                            })}
                            className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-0.5">Warna Jersey</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.sideA.jerseyColor}
                              onChange={e => setConfig({
                                ...config,
                                sideA: { ...config.sideA, jerseyColor: e.target.value }
                              })}
                              className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                            />
                            <span className="font-mono text-slate-600 text-[11px]">{config.sideA.jerseyColor}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Pelatih / Manager</label>
                        <input
                          type="text"
                          value={config.sideA.coachName || ''}
                          onChange={e => setConfig({
                            ...config,
                            sideA: { ...config.sideA, coachName: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SISI B */}
                  <div className="p-4 border border-slate-300 rounded-xs bg-[#f8fafc] space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-xs text-[#07539b] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: config.sideB.jerseyColor }} />
                        SISI B (Lapangan Kanan Awal)
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 rounded">
                        {config.sideB.code || 'DEN'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Nama Tim / Negara</label>
                        <input
                          type="text"
                          value={config.sideB.name}
                          onChange={e => setConfig({
                            ...config,
                            sideB: { ...config.sideB, name: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-0.5">Kode Singkatan</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={config.sideB.code}
                            onChange={e => setConfig({
                              ...config,
                              sideB: { ...config.sideB, code: e.target.value.toUpperCase() }
                            })}
                            className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-0.5">Warna Jersey</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.sideB.jerseyColor}
                              onChange={e => setConfig({
                                ...config,
                                sideB: { ...config.sideB, jerseyColor: e.target.value }
                              })}
                              className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                            />
                            <span className="font-mono text-slate-600 text-[11px]">{config.sideB.jerseyColor}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Pelatih / Manager</label>
                        <input
                          type="text"
                          value={config.sideB.coachName || ''}
                          onChange={e => setConfig({
                            ...config,
                            sideB: { ...config.sideB, coachName: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: PEMAIN (PLAYERS) ================= */}
            {activeTab === 'players' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Side A Players */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#07539b] bg-blue-50 p-1.5 border-l-2 border-[#07539b]">
                      Pemain Sisi A ({config.sideA.name})
                    </h3>
                    {config.sideA.players.map((player, pIdx) => (
                      <div key={player.id || pIdx} className="p-3 border border-slate-300 rounded-xs bg-[#f8fafc] space-y-2 text-xs">
                        <div className="font-bold text-slate-700 text-xs">
                          {isDoubles ? `Pemain ${pIdx + 1}, Sisi A` : 'Pemain Tunggal Sisi A'}
                        </div>
                        <input
                          type="text"
                          placeholder="Nama Lengkap"
                          value={player.name}
                          onChange={e => {
                            const updated = [...config.sideA.players];
                            updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                            setConfig({ ...config, sideA: { ...config.sideA, players: updated } });
                          }}
                          className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nama Punggung"
                            value={player.displayName}
                            onChange={e => {
                              const updated = [...config.sideA.players];
                              updated[pIdx] = { ...updated[pIdx], displayName: e.target.value.toUpperCase() };
                              setConfig({ ...config, sideA: { ...config.sideA, players: updated } });
                            }}
                            className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs font-mono uppercase"
                          />
                          <select
                            value={player.handedness}
                            onChange={e => {
                              const updated = [...config.sideA.players];
                              updated[pIdx] = { ...updated[pIdx], handedness: e.target.value as any };
                              setConfig({ ...config, sideA: { ...config.sideA, players: updated } });
                            }}
                            className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs"
                          >
                            <option value="Right">Kanan (Right)</option>
                            <option value="Left">Kidal (Left)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Side B Players */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#07539b] bg-blue-50 p-1.5 border-l-2 border-[#07539b]">
                      Pemain Sisi B ({config.sideB.name})
                    </h3>
                    {config.sideB.players.map((player, pIdx) => (
                      <div key={player.id || pIdx} className="p-3 border border-slate-300 rounded-xs bg-[#f8fafc] space-y-2 text-xs">
                        <div className="font-bold text-slate-700 text-xs">
                          {isDoubles ? `Pemain ${pIdx + 1}, Sisi B` : 'Pemain Tunggal Sisi B'}
                        </div>
                        <input
                          type="text"
                          placeholder="Nama Lengkap"
                          value={player.name}
                          onChange={e => {
                            const updated = [...config.sideB.players];
                            updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                            setConfig({ ...config, sideB: { ...config.sideB, players: updated } });
                          }}
                          className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nama Punggung"
                            value={player.displayName}
                            onChange={e => {
                              const updated = [...config.sideB.players];
                              updated[pIdx] = { ...updated[pIdx], displayName: e.target.value.toUpperCase() };
                              setConfig({ ...config, sideB: { ...config.sideB, players: updated } });
                            }}
                            className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs font-mono uppercase"
                          />
                          <select
                            value={player.handedness}
                            onChange={e => {
                              const updated = [...config.sideB.players];
                              updated[pIdx] = { ...updated[pIdx], handedness: e.target.value as any };
                              setConfig({ ...config, sideB: { ...config.sideB, players: updated } });
                            }}
                            className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs"
                          >
                            <option value="Right">Kanan (Right)</option>
                            <option value="Left">Kidal (Left)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: PRINT SETTINGS ================= */}
            {activeTab === 'print' && (
              <div className="max-w-2xl mx-auto p-4 border border-slate-300 rounded bg-[#f8fafc] space-y-3 text-xs">
                <h3 className="font-bold text-sm text-[#07539b]">Pengaturan Cetak Dokumen</h3>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.printSettings.printScoreSheet}
                    onChange={e => setConfig({ ...config, printSettings: { ...config.printSettings, printScoreSheet: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Cetak lembar skor resmi (Official BWF Score Sheet)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.printSettings.printOfficials}
                    onChange={e => setConfig({ ...config, printSettings: { ...config.printSettings, printOfficials: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Tampilkan nama & tanda tangan ofisial pada lembar cetak</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.printSettings.printRallyTimeline}
                    onChange={e => setConfig({ ...config, printSettings: { ...config.printSettings, printRallyTimeline: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Sertakan kronologi rally poin per poin (Rally Log)</span>
                </label>
              </div>
            )}

            {/* ================= TAB 6: MISC CONFIG ================= */}
            {activeTab === 'misc' && (
              <div className="max-w-2xl mx-auto p-4 border border-slate-300 rounded bg-[#f8fafc] space-y-3 text-xs">
                <h3 className="font-bold text-sm text-[#07539b]">Konfigurasi Lainnya</h3>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.miscConfig.showLiveScore}
                    onChange={e => setConfig({ ...config, miscConfig: { ...config.miscConfig, showLiveScore: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Aktifkan tampilan live scoreboard realtime</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.miscConfig.tvOverlayMode}
                    onChange={e => setConfig({ ...config, miscConfig: { ...config.miscConfig, tvOverlayMode: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Mode Graphic Overlay TV (16:9 untuk Siaran Streaming)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={config.miscConfig.autoCourtChange}
                    onChange={e => setConfig({ ...config, miscConfig: { ...config.miscConfig, autoCourtChange: e.target.checked } })}
                    className="text-[#07539b]"
                  />
                  <span>Otomatisasi pengingat ganti sisi lapangan (Gim 3 pada skor 11)</span>
                </label>
              </div>
            )}

          </form>
        </div>

        {/* PINNED BOTTOM ACTION BAR - Always visible, exactly as in user image_f8b0d91e.png */}
        <div className="sticky bottom-0 bg-[#f8fafc] border-t border-slate-300 px-5 py-2.5 flex items-center justify-between text-xs shrink-0 select-none">
          <span className="text-slate-500 font-mono text-[11px]">
            Badminton Live Stats Pro · Format Engine v1.0
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded shadow-2xs transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-5 py-1.5 font-bold text-white bg-[#07539b] hover:bg-[#06427d] rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              {lang === 'id' ? 'Simpan & Konfirmasi Pertandingan' : 'Save & Confirm Match'}
            </button>
          </div>
        </div>

      </div>

      {/* Detail Ofisial Modal */}
      {editingOfficialIndex !== null && config.officials[editingOfficialIndex] && (
        <OfficialMoreModal
          official={config.officials[editingOfficialIndex]}
          index={editingOfficialIndex}
          isOpen={editingOfficialIndex !== null}
          onClose={() => setEditingOfficialIndex(null)}
          onSave={handleSaveOfficialDetail}
        />
      )}
    </div>
  );
};
