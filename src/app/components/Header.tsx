import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeLeague: 'futsal' | 'campo';
  setActiveLeague: (league: 'futsal' | 'campo') => void;
}

export function Header({ activeSection, setActiveSection, activeLeague, setActiveLeague }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0f4c2e] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="text-xl md:text-2xl font-bold text-[#d4af37]">LZMF</div>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveLeague('futsal')}
                className={`px-3 xl:px-4 py-2 text-sm transition-all ${
                  activeLeague === 'futsal'
                    ? 'bg-white text-[#0f4c2e]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Futsal
              </button>
              <button
                onClick={() => setActiveLeague('campo')}
                className={`px-3 xl:px-4 py-2 text-sm transition-all ${
                  activeLeague === 'campo'
                    ? 'bg-white text-[#0f4c2e]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Campo
              </button>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
              <button
                onClick={() => {
                  setActiveSection('inicio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 xl:px-4 py-2 text-sm transition-colors ${
                  activeSection === 'inicio'
                    ? 'text-white font-medium bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => {
                  setActiveSection('noticias');
                  const element = document.getElementById('noticias-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 xl:px-4 py-2 text-sm transition-colors ${
                  activeSection === 'noticias'
                    ? 'text-white font-medium bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Notícias
              </button>
              <button
                onClick={() => {
                  setActiveSection('classificacao');
                  const element = document.getElementById('classificacao-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 xl:px-4 py-2 text-sm transition-colors ${
                  activeSection === 'classificacao'
                    ? 'text-white font-medium bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Classificação
              </button>
              <button
                onClick={() => {
                  setActiveSection('jogos');
                  const element = document.getElementById('jogos-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 xl:px-4 py-2 text-sm transition-colors ${
                  activeSection === 'jogos'
                    ? 'text-white font-medium bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Jogos
              </button>
              <button
                onClick={() => setActiveSection('times')}
                className={`px-3 xl:px-4 py-2 text-sm transition-colors ${
                  activeSection === 'times'
                    ? 'text-white font-medium bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Times
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setActiveLeague('futsal');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-4 py-3 text-sm transition-all rounded-lg ${
                  activeLeague === 'futsal'
                    ? 'bg-white text-[#0f4c2e]'
                    : 'bg-white/10 text-white'
                }`}
              >
                Futsal
              </button>
              <button
                onClick={() => {
                  setActiveLeague('campo');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-4 py-3 text-sm transition-all rounded-lg ${
                  activeLeague === 'campo'
                    ? 'bg-white text-[#0f4c2e]'
                    : 'bg-white/10 text-white'
                }`}
              >
                Campo
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveSection('inicio');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'inicio'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => {
                  setActiveSection('noticias');
                  setMobileMenuOpen(false);
                  const element = document.getElementById('noticias-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'noticias'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Notícias
              </button>
              <button
                onClick={() => {
                  setActiveSection('classificacao');
                  setMobileMenuOpen(false);
                  const element = document.getElementById('classificacao-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'classificacao'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Classificação
              </button>
              <button
                onClick={() => {
                  setActiveSection('jogos');
                  setMobileMenuOpen(false);
                  const element = document.getElementById('jogos-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'jogos'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Tabela de Jogos
              </button>
              <button
                onClick={() => {
                  setActiveSection('times');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'times'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Times
              </button>
              <button
                onClick={() => {
                  setActiveSection('estatisticas');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-left transition-colors rounded-lg ${
                  activeSection === 'estatisticas'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Estatísticas
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
