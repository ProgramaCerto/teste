import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User, Shield, ChevronRight, X, Check, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';
import { CertoFlowLogo } from './CertoFlowLogo';

interface ProfileSelectScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onSelectGuest: () => void;
  onAddProfile: (name: string, color: string) => void;
  onDeleteProfile: (id: string) => void;
}

const AVATAR_COLOR_PALETTE = [
  '#0066FF',
  '#00A3FF',
  '#10B981',
  '#8B5CF6',
  '#1F1F1F',
];

export const ProfileSelectScreen: React.FC<ProfileSelectScreenProps> = ({
  profiles,
  onSelectProfile,
  onSelectGuest,
  onAddProfile,
  onDeleteProfile,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLOR_PALETTE[0]);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onAddProfile(newProfileName.trim(), selectedColor);
    setNewProfileName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="relative min-h-full w-full flex flex-col justify-between p-6 bg-[#FFFFFF] text-[#1F1F1F] select-none">
      {/* Top Header with CertoFlow Logo */}
      <header className="pt-2 flex flex-col items-center text-center">
        <CertoFlowLogo size={42} />
        <h2 className="text-xl font-bold text-[#1F1F1F] mt-4 font-['Outfit']">
          Quem está navegando?
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Selecione seu perfil para acessar seus favoritos e histórico
        </p>
      </header>

      {/* Main Content: Zero State OR Real User Profiles */}
      <main className="my-auto py-8 flex flex-col items-center w-full max-w-md mx-auto">
        {profiles.length === 0 ? (
          /* MANDATORY CRUCIAL REQUIREMENT: ZERO-STATE (Nenhum perfil cadastrado) */
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F1F3F4] text-slate-400 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-slate-400 stroke-[1.5]" />
            </div>

            <h3 className="text-base font-semibold text-[#1F1F1F] mb-1">
              Nenhum perfil cadastrado
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              Crie um perfil para salvar seus favoritos, abas e preferências personalizadas.
            </p>

            {/* Main Highlighted Rounded Card Button: + Criar Novo Perfil */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-[#0066FF]/20 hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ Criar Novo Perfil</span>
            </motion.button>
          </div>
        ) : (
          /* Grid of saved profiles if created by the user */
          <div className="w-full space-y-3">
            <div className="grid grid-cols-2 gap-3.5">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="relative group p-4 rounded-2xl light-card hover:border-slate-300 transition-all text-center cursor-pointer flex flex-col items-center"
                  onClick={() => onSelectProfile(profile)}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm mb-2"
                    style={{ backgroundColor: profile.avatarColor || '#0066FF' }}
                  >
                    {profile.initials}
                  </div>
                  <span className="font-semibold text-xs text-[#1F1F1F] truncate max-w-[110px]">
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Perfil Salvo</span>

                  {/* Delete profile option */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProfile(profile.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100"
                    title="Remover perfil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Profile Card in Grid */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0066FF] bg-[#F8F9FA] hover:bg-white transition-all text-center flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 text-slate-500" />
                </div>
                <span className="font-medium text-xs text-slate-600">
                  + Adicionar Perfil
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer: Quick Access as Guest ("Entrar como Visitante") */}
      <footer className="pt-4 border-t border-[rgba(0,0,0,0.06)] flex flex-col items-center w-full max-w-md mx-auto">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSelectGuest}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#F1F3F4] hover:bg-[#E8EAED] border border-transparent text-[#1F1F1F] flex items-center justify-between text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-xs">
              <Shield className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#1F1F1F]">
                Entrar como Visitante
              </span>
              <span className="block text-[10px] text-slate-500">
                Navegação anônima sem salvar histórico
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.button>
      </footer>

      {/* Modal: Criar Novo Perfil */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white light-floating p-6 relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedColor }}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1F1F1F]">
                    Criar Novo Perfil
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina o nome e a cor de identificação
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nome do Perfil
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Trabalho, Pessoal, Estudos..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-300 text-[#1F1F1F] placeholder-slate-400 text-sm focus:outline-none focus:border-[#0066FF] transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cor de Destaque
                  </label>
                  <div className="flex items-center gap-3">
                    {AVATAR_COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                          selectedColor === color ? 'scale-110 ring-2 ring-slate-900 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl brand-gradient text-white text-xs font-semibold hover:opacity-95 shadow-sm shadow-[#0066FF]/20"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
