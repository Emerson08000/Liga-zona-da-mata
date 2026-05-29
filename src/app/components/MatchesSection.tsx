import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface MatchesSectionProps {
  activeLeague: 'futsal' | 'campo';
}

export function MatchesSection({ activeLeague }: MatchesSectionProps) {
  const { matches: allMatches, teams } = useAdmin();
  const [filter, setFilter] = useState<'all' | 'finished' | 'upcoming'>('all');

  // Filtrar jogos por liga
  let matches = allMatches.filter(m => m.league === activeLeague);

  // Aplicar filtro de status
  if (filter === 'finished') {
    matches = matches.filter(m => m.status === 'finished');
  } else if (filter === 'upcoming') {
    matches = matches.filter(m => m.status === 'scheduled');
  }

  // Função para buscar nome do time
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Time desconhecido';
  };
  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-xl md:text-2xl text-gray-900">Jogos</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-[#0f4c2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('finished')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors ${
              filter === 'finished'
                ? 'bg-[#0f4c2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resultados
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors ${
              filter === 'upcoming'
                ? 'bg-[#0f4c2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Próximos
          </button>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        {matches.length > 0 ? matches.map((match) => {
          const homeTeam = getTeamName(match.homeTeamId);
          const awayTeam = getTeamName(match.awayTeamId);
          const statusText = match.status === 'finished' ? 'Finalizado' : 'Agendado';

          return (
            <div key={match.id} className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-600">{match.date} - {match.time}</span>
                </div>
                <span className={`px-2 md:px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                  match.status === 'finished'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-100 text-[#0f4c2e]'
                }`}>
                  {statusText}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
                <div className="flex-1 text-right pr-2 md:pr-6 min-w-0">
                  <div className="text-sm md:text-base text-gray-900 mb-1 md:mb-2 truncate">{homeTeam}</div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm md:text-lg ml-auto flex-shrink-0">
                    {homeTeam.charAt(0)}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 flex-shrink-0">
                  {match.status === 'finished' ? (
                    <>
                      <div className="text-2xl md:text-3xl text-gray-900 font-bold">{match.homeScore ?? 0}</div>
                      <div className="text-gray-400">-</div>
                      <div className="text-2xl md:text-3xl text-gray-900 font-bold">{match.awayScore ?? 0}</div>
                    </>
                  ) : (
                    <div className="text-lg md:text-xl text-gray-400">vs</div>
                  )}
                </div>
                <div className="flex-1 text-left pl-2 md:pl-6 min-w-0">
                  <div className="text-sm md:text-base text-gray-900 mb-1 md:mb-2 truncate">{awayTeam}</div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm md:text-lg flex-shrink-0">
                    {awayTeam.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 pt-3 md:pt-4 border-t border-gray-100">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="truncate">{match.venue}</span>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">Nenhum jogo cadastrado ainda</p>
          </div>
        )}
      </div>
    </section>
  );
}
