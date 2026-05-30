import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export function MatchesManager() {
  const { teams, matches, addMatch, updateMatch, deleteMatch } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    league: 'futsal' as 'futsal' | 'campo',
    homeTeamId: '',
    awayTeamId: '',
    homeScore: '',
    awayScore: '',
    date: '',
    time: '',
    venue: '',
    status: 'scheduled' as 'scheduled' | 'finished',
    competition: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchData = {
      ...formData,
      homeScore: formData.homeScore ? parseInt(formData.homeScore) : undefined,
      awayScore: formData.awayScore ? parseInt(formData.awayScore) : undefined,
      competition: formData.competition || undefined,
    };
    if (editingId) {
      updateMatch(editingId, matchData);
      setEditingId(null);
    } else {
      addMatch(matchData);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => setFormData({
    league: 'futsal', homeTeamId: '', awayTeamId: '',
    homeScore: '', awayScore: '', date: '', time: '',
    venue: '', status: 'scheduled', competition: '',
  });

  const handleEdit = (match: any) => {
    setEditingId(match.id);
    setFormData({
      league: match.league,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeScore: match.homeScore?.toString() || '',
      awayScore: match.awayScore?.toString() || '',
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status,
      competition: match.competition || '',
    });
    setIsAdding(true);
  };

  const handleCancel = () => { setIsAdding(false); setEditingId(null); resetForm(); };
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Time não encontrado';
  const leagueTeams = teams.filter(t => t.league === formData.league);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Gerenciar Jogos</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">
            <Plus className="w-4 h-4" /> Adicionar Jogo
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">{editingId ? 'Editar Jogo' : 'Novo Jogo'}</h3>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Liga</label>
                <select value={formData.league} onChange={(e) => setFormData({ ...formData, league: e.target.value as 'futsal' | 'campo', homeTeamId: '', awayTeamId: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]">
                  <option value="futsal">Futsal</option>
                  <option value="campo">Campo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Competição (opcional)</label>
                <input type="text" value={formData.competition}
                  onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: Copa Zona da Mata Sub-15" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Time da Casa</label>
                <select value={formData.homeTeamId} onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" required>
                  <option value="">Selecione um time</option>
                  {leagueTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Time Visitante</label>
                <select value={formData.awayTeamId} onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" required>
                  <option value="">Selecione um time</option>
                  {leagueTeams.filter(t => t.id !== formData.homeTeamId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Data</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Horário</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'finished' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]">
                  <option value="scheduled">Agendado</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Local</label>
              <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                placeholder="Ex: Ginásio Municipal" required />
            </div>

            {formData.status === 'finished' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Placar Casa</label>
                  <input type="number" value={formData.homeScore} onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" min="0" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Placar Visitante</label>
                  <input type="number" value={formData.awayScore} onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" min="0" required />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="submit" className="px-6 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">
                {editingId ? 'Salvar Alterações' : 'Adicionar Jogo'}
              </button>
              <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {(['futsal', 'campo'] as const).map((league) => (
          <div key={league}>
            <h3 className="text-sm text-gray-600 mb-3">Jogos de {league === 'futsal' ? 'Futsal' : 'Campo'}</h3>
            <div className="space-y-3">
              {matches.filter(m => m.league === league)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((match) => (
                  <div key={match.id} className="p-4 bg-gray-50 rounded-lg">
                    {match.competition && (
                      <div className="text-xs font-semibold text-[#0f4c2e] uppercase tracking-wide mb-2">{match.competition}</div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{new Date(match.date).toLocaleDateString('pt-BR')} - {match.time}</span>
                        <span className={`px-2 py-1 text-xs rounded ${match.status === 'finished' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {match.status === 'finished' ? 'Finalizado' : 'Agendado'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(match)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button onClick={() => deleteMatch(match.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1"><div className="text-gray-900">{getTeamName(match.homeTeamId)}</div></div>
                      <div className="px-4 text-center">
                        {match.status === 'finished'
                          ? <div className="text-xl text-gray-900">{match.homeScore} - {match.awayScore}</div>
                          : <div className="text-gray-400">vs</div>}
                      </div>
                      <div className="flex-1 text-right"><div className="text-gray-900">{getTeamName(match.awayTeamId)}</div></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{match.venue}</div>
                  </div>
                ))}
              {matches.filter(m => m.league === league).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">Nenhum jogo de {league === 'futsal' ? 'futsal' : 'campo'} cadastrado</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
