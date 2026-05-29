import { Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f4c2e] text-white mt-8 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl mb-3 md:mb-4 text-[#d4af37]">LZMF</h3>
            <p className="text-green-200 text-xs md:text-sm">
              Liga Zona da Mata de Futebol - Promovendo o melhor do futebol regional desde 2019.
            </p>
          </div>
          <div>
            <h4 className="text-base mb-3 md:mb-4 text-[#d4af37]">Liga</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li><a href="#" className="hover:text-white transition-colors">Sobre a LZMF</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Regulamento</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Times Filiados</a></li>
              <li><a href="#" className="hover:text-white transition-colors">História</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base mb-3 md:mb-4 text-[#d4af37]">Competições</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li><a href="#" className="hover:text-white transition-colors">Campeonato Regional</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Copa LZMF</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Taça Zona da Mata</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Categorias de Base</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base mb-3 md:mb-4 text-[#d4af37]">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ligazonadamatafutebol/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@ligazonadamatadefutebol792" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-green-200">
          <p>&copy; 2026 Liga Zona da Mata de Futebol. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
