import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface MatchesSectionProps {
  activeLeague: 'futsal' | 'campo';
}

function TeamLogo({ logo, name, size = 'md' }: { logo?: string; name: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  if (logo) return <img src={logo} alt={name} className={`${dim} object-contain rounded-full flex-shrink-0`} />;
  return (
    <div className={`${dim} bg-white/80 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

export function MatchesSection({ activeLeague }: MatchesSectionProps) {
  const { matches: allMatches, teams } = useAdmin();
  const [filter, setFilter] = useState<'all' | 'finished' | 'upcoming'>('all');

  let matches = allMatches.filter(m => m.league === activeLeague);
  if (filter === 'finished') matches = matches.filter(m => m.status === 'finished');
  else if (filter === 'upcoming') matches = matches.filter(m => m.status === 'scheduled');

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-xl md:text-2xl text-gray-900">Jogos</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {(['all', 'finished', 'upcoming'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                filter === f ? 'bg-[#0f4c2e] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {f === 'all' ? 'Todos' : f === 'finished' ? 'Resultados' : 'Próximos'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {matches.length > 0 ? matches.map((match) => {
          const homeTeam = getTeam(match.homeTeamId);
          const awayTeam = getTeam(match.awayTeamId);
          const homeName = homeTeam?.name || 'Time desconhecido';
          const awayName = awayTeam?.name || 'Time desconhecido';

          return (
            <div key={match.id} className="bg-[#0f4c2e] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Cabeçalho verde escuro com competição, data e status */}
              <div className="px-4 md:px-6 pt-4 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  {match.competition && (
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wide">{match.competition}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-green-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-green-200">{match.date} - {match.time}</span>
                  </div>
                </div>
                <span className={`px-2 md:px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
                  match.status === 'finished' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {match.status === 'finished' ? 'Finalizado' : 'Agendado'}
                </span>
              </div>

              {/* Corpo branco com os times */}
              <div className="bg-white mx-3 mb-3 rounded-lg p-4 md:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-right pr-2 md:pr-6 min-w-0">
                    <div className="text-sm md:text-base text-gray-900 mb-2 truncate">{homeName}</div>
                    <div className="ml-auto w-fit">
                      <TeamLogo logo={homeTeam?.logo} name={homeName} />
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
                      <div className="text-lg md:text-xl text-gray-400 font-medium">vs</div>
                    )}
                  </div>
                  <div className="flex-1 text-left pl-2 md:pl-6 min-w-0">
                    <div className="text-sm md:text-base text-gray-900 mb-2 truncate">{awayName}</div>
                    <TeamLogo logo={awayTeam?.logo} name={awayName} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 pt-3 mt-3 border-t border-gray-100">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{match.venue}</span>
                </div>
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
