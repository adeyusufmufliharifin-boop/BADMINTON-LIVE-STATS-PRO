import React, { useState } from 'react';
import { Official } from '../types/badminton';
import { X, Award, Check } from 'lucide-react';

interface OfficialMoreModalProps {
  official: Official;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Official) => void;
}

export const OfficialMoreModal: React.FC<OfficialMoreModalProps> = ({
  official,
  index,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Official>({ ...official });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header bar matching the software aesthetic */}
        <div className="bg-[#263243] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm tracking-wide">
              Detail Ofisial #{index + 1}: {formData.firstName || 'Tanpa Nama'} {formData.lastName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nama Depan</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-[#07539b] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nama Belakang</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-[#07539b] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Peran Resmi di Pertandingan</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white focus:border-[#07539b] focus:outline-hidden"
            >
              <option value="Wasit Utama (Umpire)">Wasit Utama (Umpire)</option>
              <option value="Hakim Servis (Service Judge)">Hakim Servis (Service Judge)</option>
              <option value="Hakim Garis 1 (Line Judge)">Hakim Garis 1 (Line Judge)</option>
              <option value="Hakim Garis 2 (Line Judge)">Hakim Garis 2 (Line Judge)</option>
              <option value="Referee Turnamen">Referee Turnamen (Tournament Referee)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tingkat Lisensi / Akreditasi</label>
              <input
                type="text"
                placeholder="misal: BWF Certificated / Nasional A"
                value={formData.licenseLevel || ''}
                onChange={e => setFormData({ ...formData, licenseLevel: e.target.value })}
                className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-[#07539b] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Federasi / Asosiasi</label>
              <input
                type="text"
                placeholder="misal: PBSI / BWF / Badminton Asia"
                value={formData.federation || ''}
                onChange={e => setFormData({ ...formData, federation: e.target.value })}
                className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-[#07539b] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Catatan Khusus / Posisi Garis</label>
            <textarea
              rows={3}
              placeholder="Catatan penugasan wasit, posisi garis (baseline/sideline), dsb."
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:border-[#07539b] focus:outline-hidden text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#07539b] hover:bg-[#06427d] rounded flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
