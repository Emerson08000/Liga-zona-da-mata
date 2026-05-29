import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '../../imports/WhatsApp_Image_2026-05-25_at_20.47.31-1.jpeg';
import { useAdmin } from '../contexts/AdminContext';

interface HeroProps {
  activeLeague: 'futsal' | 'campo';
}

export function Hero({ activeLeague }: HeroProps) {
  const { matches, teams } = useAdmin();

  // Buscar próximo jogo agendado da liga ativa
  const upcomingMatches = matches
    .filter(m => m.league === activeLeague && m.status === 'scheduled')
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.time);
      const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

  const nextMatch = upcomingMatches[0];

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Time desconhecido';
  };

  return (
    <div className="relative bg-gradient-to-r from-[#0f4c2e] to-[#1a7a4a] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="inline-block mb-4">
              <ImageWithFallback
                src={logoImage}
                alt="LZMF - Liga Zona da Mata de Futebol"
                className="h-24 sm:h-32 md:h-40 w-auto mx-auto lg:mx-0"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 leading-tight">
              Liga Zona da Mata de {activeLeague === 'futsal' ? 'Futsal' : 'Campo'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#d4af37] mb-4 md:mb-6">
              Temporada 2026 - O melhor do {activeLeague === 'futsal' ? 'futsal' : 'futebol de campo'} regional
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => {
                  const element = document.getElementById('jogos-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#d4af37] text-black font-semibold rounded-lg hover:bg-[#f0d474] transition-colors text-sm md:text-base"
              >
                Ver Jogos
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('classificacao-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base"
              >
                Classificação
              </button>
            </div>
          </div>
          {nextMatch && (
            <div className="flex-1 max-w-md w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <h3 className="text-base md:text-lg mb-3 md:mb-4">Próximo Jogo</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center text-xl md:text-2xl flex-shrink-0">⚽</div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">{getTeamName(nextMatch.homeTeamId)}</div>
                        <div className="text-xs md:text-sm text-green-200">Casa</div>
                      </div>
                    </div>
                    <div className="text-lg md:text-2xl flex-shrink-0 px-2">vs</div>
                    <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                      <div className="min-w-0 text-right">
                        <div className="font-medium text-sm md:text-base truncate">{getTeamName(nextMatch.awayTeamId)}</div>
                        <div className="text-xs md:text-sm text-green-200">Visitante</div>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center text-xl md:text-2xl flex-shrink-0">⚽</div>
                    </div>
                  </div>
                  <div className="text-center pt-3 md:pt-4 border-t border-white/20">
                    <div className="text-xs md:text-sm text-green-200">{nextMatch.date}</div>
                    <div className="font-medium text-sm md:text-base">{nextMatch.time} - {nextMatch.venue}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
