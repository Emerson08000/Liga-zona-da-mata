import { Trophy } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface StandingsSectionProps {
  activeLeague: 'futsal' | 'campo';
}

function TeamLogo({ logo, name }: { logo?: string; name: string }) {
  if (logo) {
    return <img src={logo} alt={name} className="w-5 h-5 object-contain rounded-full flex-shrink-0" />;
  }
  return (
    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">
      {name.charAt(0)}
    </div>
  );
}

export function StandingsSection({ activeLeague }: StandingsSectionProps) {
  const { teams, matches } = useAdmin();

  const leagueTeams = teams.filter(t => t.league === activeLeague);

  const teamStats = leagueTeams.map(team => {
    const teamMatches = matches.filter(
      m => m.league === activeLeague && m.status === 'finished' &&
      (m.homeTeamId === team.id || m.awayTeamId === team.id)
    );
    let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
    teamMatches.forEach(match => {
      const isHome = match.homeTeamId === team.id;
      const teamGoals = isHome ? (match.homeScore || 0) : (match.awayScore || 0);
      const opponentGoals = isHome ? (match.awayScore || 0) : (match.homeScore || 0);
      goalsFor += teamGoals;
      goalsAgainst += opponentGoals;
      if (teamGoals > opponentGoals) wins++;
      else if (teamGoals === opponentGoals) draws++;
      else losses++;
    });
    return {
      id: team.id,
      name: team.name,
      logo: team.logo,
      group: team.group || '',
      played: teamMatches.length,
      wins, draws, losses, goalsFor, goalsAgainst,
      points: wins * 3 + draws,
    };
  });

  const groups = Array.from(new Set(teamStats.map(t => t.group).filter(Boolean))).sort();
  const hasGroups = groups.length > 0;

  const sortTeams = (t: typeof teamStats) =>
    [...t].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

  const renderTable = (rows: typeof teamStats, highlight = 2) => (
    <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
      <table className="w-full min-w-[280px]">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-2 text-xs text-gray-600">#</th>
            <th className="pb-2 text-xs text-gray-600">Time</th>
            <th className="pb-2 text-xs text-gray-600 text-center">P</th>
            <th className="pb-2 text-xs text-gray-600 text-center">J</th>
            <th className="pb-2 text-xs text-gray-600 text-center">SG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((team, index) => (
            <tr key={team.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index < highlight ? 'bg-blue-50/30' : ''}`}>
              <td className="py-2">
                <div className={`w-5 h-5 flex items-center justify-center rounded text-xs ${
                  index === 0 ? 'bg-[#0f4c2e] text-white' :
                  index < highlight ? 'bg-green-100 text-[#0f4c2e]' : 'text-gray-600'
                }`}>{index + 1}</div>
              </td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <TeamLogo logo={team.logo} name={team.name} />
                  <span className="text-xs md:text-sm text-gray-900 truncate">{team.name}</span>
                </div>
              </td>
              <td className="py-2 text-center text-sm text-gray-900 font-medium">{team.points}</td>
              <td className="py-2 text-center text-gray-600 text-xs">{team.played}</td>
              <td className="py-2 text-center text-gray-600 text-xs">
                {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="lg:sticky lg:top-20">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#d4af37]" />
          <h2 className="text-lg md:text-xl text-gray-900">Classificação</h2>
        </div>
        <div className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">Temporada 2026</div>

        {teamStats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum time cadastrado ainda</p>
          </div>
        ) : hasGroups ? (
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 bg-[#0f4c2e] text-white text-xs rounded font-medium">Grupo {group}</div>
                </div>
                {renderTable(sortTeams(teamStats.filter(t => t.group === group)))}
              </div>
            ))}
            {teamStats.filter(t => !t.group).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 bg-gray-500 text-white text-xs rounded font-medium">Sem Grupo</div>
                </div>
                {renderTable(sortTeams(teamStats.filter(t => !t.group)))}
              </div>
            )}
          </div>
        ) : renderTable(sortTeams(teamStats), 4)}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Classificação para próxima fase</span>
          </div>
        </div>
      </div>
    </section>
  );
}
