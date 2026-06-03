import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import type { Competition, CompetitionGroup } from '../../contexts/AdminContext';
import { Plus, Trash2, Edit, X, ChevronDown, ChevronUp, Users, Trophy } from 'lucide-react';

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const TIEBREAK_RULES = [
  'Pontos',
  'Vitórias',
  'Saldo de Gols',
  'Gols Pró',
  'Confronto Direto',
  'Menor nº de Cartões Vermelhos',
  'Menor nº de Cartões Amarelos',
];

// ─── Formulário de competição ────────────────────────────────────────────────
function CompetitionForm({
  initial,
  onSave,
  onCancel,
  teams,
}: {
  initial?: Competition;
  onSave: (c: Omit<Competition, 'id'>) => void;
  onCancel: () => void;
  teams: ReturnType<typeof useAdmin>['teams'];
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [league, setLeague] = useState<'futsal' | 'campo'>(initial?.league ?? 'futsal');
  const [season, setSeason] = useState(initial?.season ?? new Date().getFullYear().toString());
  const [groups, setGroups] = useState<Omit<CompetitionGroup, 'competitionId'>[]>(
    initial?.groups.map(g => ({ id: g.id, name: g.name, teamIds: g.teamIds, advanceSpots: g.advanceSpots })) ??
    [{ id: genId(), name: 'A', teamIds: [], advanceSpots: 2 }]
  );

  const leagueTeams = teams.filter(t => t.league === league);

  const addGroup = () => setGroups(g => [...g, { id: genId(), name: String.fromCharCode(65 + g.length), teamIds: [], advanceSpots: 2 }]);
  const removeGroup = (id: string) => setGroups(g => g.filter(x => x.id !== id));

  const updateGroup = (id: string, patch: Partial<Omit<CompetitionGroup, 'id' | 'competitionId'>>) =>
    setGroups(g => g.map(x => x.id === id ? { ...x, ...patch } : x));

  const toggleTeam = (groupId: string, teamId: string) => {
    setGroups(gs => gs.map(g => {
      if (g.id !== groupId) return g;
      const has = g.teamIds.includes(teamId);
      return { ...g, teamIds: has ? g.teamIds.filter(id => id !== teamId) : [...g.teamIds, teamId] };
    }));
  };

  const handleSave = () => {
    if (!name.trim()) return alert('Informe o nome da competição.');
    onSave({ name: name.trim(), league, season, groups: groups.map(g => ({ ...g, competitionId: '' })) });
  };

  // Teams already assigned (in other groups of THIS competition)
  const assignedTeams = (currentGroupId: string) =>
    new Set(groups.filter(g => g.id !== currentGroupId).flatMap(g => g.teamIds));

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg text-gray-900">{initial ? 'Editar Competição' : 'Nova Competição'}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Nome da Competição</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] text-sm"
            placeholder="Ex: Campeonato Lajense Adulto" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Liga</label>
          <select value={league} onChange={e => setLeague(e.target.value as 'futsal' | 'campo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] text-sm">
            <option value="futsal">Futsal</option>
            <option value="campo">Campo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Temporada</label>
          <input value={season} onChange={e => setSeason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] text-sm"
            placeholder="Ex: 2026" />
        </div>
      </div>

      {/* Critérios de desempate (informativo) */}
      <div className="mb-6 p-3 bg-[#0f4c2e]/5 border border-[#0f4c2e]/20 rounded-lg">
        <p className="text-xs font-semibold text-[#0f4c2e] mb-2 uppercase tracking-wide">Critérios de Desempate (padrão CBF)</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {TIEBREAK_RULES.map((r, i) => (
            <span key={r} className="text-xs text-gray-600">{i + 1}. {r}</span>
          ))}
        </div>
      </div>

      {/* Grupos */}
      <div className="space-y-4 mb-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">Grupos</h4>
          <button onClick={addGroup}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">
            <Plus className="w-3 h-3" /> Adicionar Grupo
          </button>
        </div>

        {groups.map((group) => {
          const already = assignedTeams(group.id);
          return (
            <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Nome do Grupo:</span>
                  <input value={group.name} onChange={e => updateGroup(group.id, { name: e.target.value })}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                    placeholder="Ex: A" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Times que avançam:</span>
                  <input type="number" min={1} max={20} value={group.advanceSpots}
                    onChange={e => updateGroup(group.id, { advanceSpots: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" />
                </div>
                {groups.length > 1 && (
                  <button onClick={() => removeGroup(group.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors ml-auto">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Times no grupo ({group.teamIds.length} selecionados)
                </p>
                {leagueTeams.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhum time de {league} cadastrado ainda.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {leagueTeams.map(team => {
                      const isSelected = group.teamIds.includes(team.id);
                      const isDisabled = !isSelected && already.has(team.id);
                      return (
                        <label key={team.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-colors
                            ${isDisabled ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50' :
                              isSelected ? 'border-[#0f4c2e] bg-[#0f4c2e]/5 text-[#0f4c2e]' :
                              'border-gray-200 hover:border-gray-300 bg-white text-gray-700'}`}>
                          <input type="checkbox" checked={isSelected} disabled={isDisabled}
                            onChange={() => !isDisabled && toggleTeam(group.id, team.id)}
                            className="accent-[#0f4c2e] w-3 h-3" />
                          {team.logo && <img src={team.logo} alt={team.name} className="w-4 h-4 object-contain rounded-full" />}
                          <span className="truncate">{team.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave}
          className="px-6 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors text-sm">
          {initial ? 'Salvar Alterações' : 'Criar Competição'}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export function StandingsManager() {
  const { competitions, teams, matches, addCompetition, updateCompetition, deleteCompetition } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const handleSave = (comp: Omit<Competition, 'id'>) => {
    if (editingId) {
      updateCompetition(editingId, comp);
      setEditingId(null);
    } else {
      addCompetition(comp);
      setIsAdding(false);
    }
  };

  const handleEdit = (comp: Competition) => {
    setEditingId(comp.id);
    setIsAdding(true);
  };

  const handleCancel = () => { setIsAdding(false); setEditingId(null); };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta competição?')) deleteCompetition(id);
  };

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Time não encontrado';
  const getTeamLogo = (id: string) => teams.find(t => t.id === id)?.logo;

  // Calcula stats de um time dentro de uma competição (só jogos da competition)
  const getStats = (teamId: string, compName: string, league: string) => {
    const ms = matches.filter(m =>
      m.league === league && m.status === 'finished' &&
      m.competition === compName &&
      (m.homeTeamId === teamId || m.awayTeamId === teamId)
    );
    let pts = 0, j = 0, v = 0, e = 0, d = 0, gp = 0, gc = 0;
    ms.forEach(m => {
      const home = m.homeTeamId === teamId;
      const tg = home ? (m.homeScore || 0) : (m.awayScore || 0);
      const og = home ? (m.awayScore || 0) : (m.homeScore || 0);
      gp += tg; gc += og; j++;
      if (tg > og) { v++; pts += 3; }
      else if (tg === og) { e++; pts += 1; }
      else d++;
    });
    return { pts, j, v, e, d, gp, gc, sg: gp - gc };
  };

  const sortTeamIds = (teamIds: string[], compName: string, league: string) => {
    return [...teamIds].sort((a, b) => {
      const sa = getStats(a, compName, league);
      const sb = getStats(b, compName, league);
      if (sb.pts !== sa.pts) return sb.pts - sa.pts;
      if (sb.v !== sa.v) return sb.v - sa.v;
      if (sb.sg !== sa.sg) return sb.sg - sa.sg;
      return sb.gp - sa.gp;
    });
  };

  const futsalComps = competitions.filter(c => c.league === 'futsal');
  const campoComps = competitions.filter(c => c.league === 'campo');

  const renderPreview = (comp: Competition) => {
    const isOpen = expanded[comp.id];
    return (
      <div key={comp.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">{comp.name}</div>
            <div className="text-xs text-gray-500">Temporada {comp.season} · {comp.groups.length} grupo(s)</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggle(comp.id)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Ver classificação">
              {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
            </button>
            <button onClick={() => handleEdit(comp)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => handleDelete(comp.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
            {comp.groups.map(group => {
              const sorted = sortTeamIds(group.teamIds, comp.name, comp.league);
              return (
                <div key={group.id}>
                  <div className="inline-block px-2 py-0.5 bg-[#0f4c2e] text-white text-xs rounded mb-2">
                    Grupo {group.name}
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="pb-1 text-left w-6">#</th>
                        <th className="pb-1 text-left">Time</th>
                        <th className="pb-1 text-center w-8">P</th>
                        <th className="pb-1 text-center w-8">J</th>
                        <th className="pb-1 text-center w-8">V</th>
                        <th className="pb-1 text-center w-8">E</th>
                        <th className="pb-1 text-center w-8">D</th>
                        <th className="pb-1 text-center w-8">GP</th>
                        <th className="pb-1 text-center w-8">GC</th>
                        <th className="pb-1 text-center w-10">SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((teamId, idx) => {
                        const s = getStats(teamId, comp.name, comp.league);
                        const advances = idx < group.advanceSpots;
                        return (
                          <tr key={teamId} className={`border-b border-gray-50 ${advances ? 'bg-green-50' : ''}`}>
                            <td className="py-1">
                              <div className={`w-4 h-4 flex items-center justify-center rounded text-[10px] font-bold
                                ${idx === 0 ? 'bg-[#0f4c2e] text-white' : advances ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>
                                {idx + 1}
                              </div>
                            </td>
                            <td className="py-1">
                              <div className="flex items-center gap-1.5">
                                {getTeamLogo(teamId)
                                  ? <img src={getTeamLogo(teamId)} alt="" className="w-4 h-4 object-contain rounded-full" />
                                  : <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[9px]">{getTeamName(teamId).charAt(0)}</div>}
                                <span className="truncate max-w-[120px]">{getTeamName(teamId)}</span>
                              </div>
                            </td>
                            <td className="py-1 text-center font-bold text-gray-900">{s.pts}</td>
                            <td className="py-1 text-center text-gray-600">{s.j}</td>
                            <td className="py-1 text-center text-gray-600">{s.v}</td>
                            <td className="py-1 text-center text-gray-600">{s.e}</td>
                            <td className="py-1 text-center text-gray-600">{s.d}</td>
                            <td className="py-1 text-center text-gray-600">{s.gp}</td>
                            <td className="py-1 text-center text-gray-600">{s.gc}</td>
                            <td className="py-1 text-center text-gray-600">
                              {s.sg > 0 ? `+${s.sg}` : s.sg}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-gray-400 mt-1">
                    🟢 Classificam-se os {group.advanceSpots} primeiros
                  </p>
                </div>
              );
            })}
            <p className="text-[10px] text-gray-400 pt-1">
              Desempate (CBF): Pontos → Vitórias → Saldo de Gols → Gols Pró → Confronto Direto → Cartões Vermelhos → Cartões Amarelos
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Competições e Classificação</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">
            <Plus className="w-4 h-4" /> Nova Competição
          </button>
        )}
      </div>

      {isAdding && (
        <CompetitionForm
          initial={editingId ? competitions.find(c => c.id === editingId) : undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          teams={teams}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Competições de Futsal
          </h3>
          <div className="space-y-3">
            {futsalComps.map(renderPreview)}
            {futsalComps.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">Nenhuma competição de futsal criada</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Competições de Campo
          </h3>
          <div className="space-y-3">
            {campoComps.map(renderPreview)}
            {campoComps.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">Nenhuma competição de campo criada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
