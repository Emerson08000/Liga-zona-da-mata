import { useState, useMemo } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface UpcomingGamesProps {
  activeLeague: 'futsal' | 'campo';
}

export function UpcomingGames({ activeLeague }: UpcomingGamesProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7dias' | '15dias' | 'todos'>('15dias');
  const [isOpen, setIsOpen] = useState(false);
  const { matches, teams } = useAdmin();

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Time desconhecido';
  };

  const getTeamShort = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.shortName || '???';
  };

  const formatDayLabel = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matchDate = new Date(date);
    matchDate.setHours(0, 0, 0, 0);

    if (matchDate.getTime() === today.getTime()) {
      return 'Hoje';
    } else if (matchDate.getTime() === tomorrow.getTime()) {
      return 'Amanhã';
    } else {
      const day = String(matchDate.getDate()).padStart(2, '0');
      const month = String(matchDate.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    }
  };

  const getFilteredGames = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let maxDate = new Date(today);
    if (selectedPeriod === '7dias') {
      maxDate.setDate(maxDate.getDate() + 7);
    } else if (selectedPeriod === '15dias') {
      maxDate.setDate(maxDate.getDate() + 15);
    } else {
      // 'todos' - sem limite de data
      maxDate = new Date('2099-12-31');
    }

    // Filtrar jogos da liga ativa e agendados
    const upcomingMatches = matches
      .filter(m => {
        if (m.league !== activeLeague || m.status !== 'scheduled') return false;

        const matchDate = new Date(m.date.split('/').reverse().join('-'));
        matchDate.setHours(0, 0, 0, 0);

        return matchDate >= today && matchDate <= maxDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.time);
        const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.time);
        return dateA.getTime() - dateB.getTime();
      })
      .map(m => {
        const matchDate = new Date(m.date.split('/').reverse().join('-'));
        return {
          id: m.id,
          league: `LZMF ${activeLeague === 'futsal' ? 'Futsal' : 'Campo'}`,
          time: m.time,
          homeTeam: getTeamName(m.homeTeamId),
          homeShort: getTeamShort(m.homeTeamId),
          awayTeam: getTeamName(m.awayTeamId),
          awayShort: getTeamShort(m.awayTeamId),
          day: formatDayLabel(matchDate),
          date: m.date
        };
      });

    return upcomingMatches;
  }, [matches, teams, activeLeague, selectedPeriod]);

  const filteredGames = getFilteredGames;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
      <div className="mb-4">
        <label className="text-xs md:text-sm text-gray-600 mb-2 block">PRÓXIMOS JOGOS:</label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <span className="text-sm md:text-base text-gray-900">
              {selectedPeriod === '7dias' ? 'Próximos 7 dias' : selectedPeriod === '15dias' ? 'Próximos 15 dias' : 'Todos'}
            </span>
            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSelectedPeriod('7dias');
                  setIsOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-left hover:bg-gray-50 transition-colors first:rounded-t-lg"
              >
                Próximos 7 dias
              </button>
              <button
                onClick={() => {
                  setSelectedPeriod('15dias');
                  setIsOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-left hover:bg-gray-50 transition-colors"
              >
                Próximos 15 dias
              </button>
              <button
                onClick={() => {
                  setSelectedPeriod('todos');
                  setIsOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-left hover:bg-gray-50 transition-colors last:rounded-b-lg"
              >
                Todos
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        {filteredGames.map((game, index) => (
          <div key={game.id}>
            {(index === 0 || filteredGames[index - 1].date !== game.date) && (
              <div className="text-[10px] md:text-xs text-[#0f4c2e] font-medium mb-2 mt-3 md:mt-4 first:mt-0">
                {game.day} - {game.date}
              </div>
            )}
            <div className="bg-[#0f4c2e] text-white p-3 md:p-4 rounded-lg hover:bg-[#1a7a4a] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded flex items-center justify-center text-[10px] md:text-xs text-[#0f4c2e] font-bold flex-shrink-0">
                    {game.homeShort}
                  </div>
                  <span className="text-xs md:text-sm truncate">{game.homeTeam}</span>
                </div>
                <span className="text-[10px] md:text-xs text-green-200 flex-shrink-0 ml-2">{game.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded flex items-center justify-center text-[10px] md:text-xs text-[#0f4c2e] font-bold flex-shrink-0">
                    {game.awayShort}
                  </div>
                  <span className="text-xs md:text-sm truncate">{game.awayTeam}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-6 md:py-8 text-gray-500">
          <Clock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-30" />
          <p className="text-xs md:text-sm">Nenhum jogo agendado para este período</p>
        </div>
      )}
    </div>
  );
}
