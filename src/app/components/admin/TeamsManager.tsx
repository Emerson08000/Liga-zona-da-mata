import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit, Trash2, Upload, X, Users, ChevronDown, ChevronUp } from 'lucide-react';

export function TeamsManager() {
  const { teams, addTeam, updateTeam, deleteTeam, players, addPlayer, updatePlayer, deletePlayer } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [addingPlayerForTeam, setAddingPlayerForTeam] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', shortName: '', logo: '', league: 'futsal' as 'futsal' | 'campo', group: '' });
  const [playerForm, setPlayerForm] = useState({ name: '', position: '', birthDate: '', rg: '', cpf: '' });

  const resetTeamForm = () => setFormData({ name: '', shortName: '', logo: '', league: 'futsal', group: '' });
  const resetPlayerForm = () => setPlayerForm({ name: '', position: '', birthDate: '', rg: '', cpf: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) { updateTeam(editingId, formData); setEditingId(null); }
    else { addTeam(formData); setIsAdding(false); }
    resetTeamForm();
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setFormData({ name: team.name, shortName: team.shortName, logo: team.logo || '', league: team.league, group: team.group || '' });
    setIsAdding(true);
  };

  const handleCancel = () => { setIsAdding(false); setEditingId(null); resetTeamForm(); };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setFormData(f => ({ ...f, logo: reader.result as string })); reader.readAsDataURL(file); }
  };

  const handlePlayerSubmit = (e: React.FormEvent, teamId: string) => {
    e.preventDefault();
    if (editingPlayerId) {
      updatePlayer(editingPlayerId, { name: playerForm.name, position: playerForm.position || undefined, birthDate: playerForm.birthDate || undefined, rg: playerForm.rg || undefined, cpf: playerForm.cpf || undefined });
      setEditingPlayerId(null);
    } else {
      addPlayer({ teamId, name: playerForm.name, position: playerForm.position || undefined, birthDate: playerForm.birthDate || undefined, rg: playerForm.rg || undefined, cpf: playerForm.cpf || undefined });
    }
    resetPlayerForm();
    setAddingPlayerForTeam(null);
  };

  const handleEditPlayer = (player: any) => {
    setEditingPlayerId(player.id);
    setPlayerForm({ name: player.name, position: player.position || '', birthDate: player.birthDate || '', rg: player.rg || '', cpf: player.cpf || '' });
    setAddingPlayerForTeam(player.teamId);
  };

  const renderTeamList = (league: 'futsal' | 'campo') => (
    <div>
      <h3 className="text-sm text-gray-600 mb-3">Times de {league === 'futsal' ? 'Futsal' : 'Campo'}</h3>
      <div className="space-y-2">
        {teams.filter(t => t.league === league).map((team) => {
          const teamPlayers = players.filter(p => p.teamId === team.id);
          const isExpanded = expandedTeamId === team.id;
          return (
            <div key={team.id} className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Linha do time */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {team.logo
                    ? <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain rounded" />
                    : <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">{team.shortName}</div>}
                  <div>
                    <div className="text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {team.shortName}
                      {team.group && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Grupo {team.group}</span>}
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{teamPlayers.length} atletas</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExpandedTeamId(isExpanded ? null : team.id)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Ver atletas">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#0f4c2e]" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                  </button>
                  <button onClick={() => handleEdit(team)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><Edit className="w-4 h-4 text-gray-600" /></button>
                  <button onClick={() => deleteTeam(team.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </div>
              </div>

              {/* Seção de atletas expandida */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Atletas do {team.name}</h4>
                    {addingPlayerForTeam !== team.id && (
                      <button onClick={() => { setAddingPlayerForTeam(team.id); setEditingPlayerId(null); resetPlayerForm(); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0f4c2e] text-white text-xs rounded-lg hover:bg-[#1a7a4a] transition-colors">
                        <Plus className="w-3 h-3" /> Adicionar Atleta
                      </button>
                    )}
                  </div>

                  {/* Formulário de atleta */}
                  {addingPlayerForTeam === team.id && (
                    <form onSubmit={(e) => handlePlayerSubmit(e, team.id)} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{editingPlayerId ? 'Editar Atleta' : 'Novo Atleta'}</span>
                        <button type="button" onClick={() => { setAddingPlayerForTeam(null); setEditingPlayerId(null); resetPlayerForm(); }}
                          className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Nome *</label>
                          <input type="text" value={playerForm.name} onChange={e => setPlayerForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="Nome completo" required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Posição</label>
                          <input type="text" value={playerForm.position} onChange={e => setPlayerForm(f => ({ ...f, position: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="Ex: Goleiro, Pivô..." />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Data de Nascimento</label>
                          <input type="date" value={playerForm.birthDate} onChange={e => setPlayerForm(f => ({ ...f, birthDate: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">RG</label>
                          <input type="text" value={playerForm.rg} onChange={e => setPlayerForm(f => ({ ...f, rg: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="RG" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">CPF</label>
                          <input type="text" value={playerForm.cpf} onChange={e => setPlayerForm(f => ({ ...f, cpf: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="CPF" />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" className="px-4 py-2 bg-[#0f4c2e] text-white text-sm rounded-lg hover:bg-[#1a7a4a] transition-colors">
                          {editingPlayerId ? 'Salvar' : 'Adicionar'}
                        </button>
                        <button type="button" onClick={() => { setAddingPlayerForTeam(null); setEditingPlayerId(null); resetPlayerForm(); }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                      </div>
                    </form>
                  )}

                  {/* Lista de atletas */}
                  {teamPlayers.length > 0 ? (
                    <div className="space-y-2">
                      {teamPlayers.map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                            <div className="text-xs text-gray-500 flex gap-3">
                              {player.position && <span>{player.position}</span>}
                              {player.birthDate && <span>Nasc: {new Date(player.birthDate).toLocaleDateString('pt-BR')}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditPlayer(player)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5 text-gray-600" /></button>
                            <button onClick={() => deletePlayer(player.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Nenhum atleta cadastrado</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {teams.filter(t => t.league === league).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Nenhum time de {league === 'futsal' ? 'futsal' : 'campo'} cadastrado</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Gerenciar Times</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">
            <Plus className="w-4 h-4" /> Adicionar Time
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">{editingId ? 'Editar Time' : 'Novo Time'}</h3>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome do Time</label>
                <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="Ex: EC Viçosa" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Abreviação</label>
                <input type="text" value={formData.shortName} onChange={e => setFormData(f => ({ ...f, shortName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="Ex: VIC" maxLength={3} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Liga</label>
                <select value={formData.league} onChange={e => setFormData(f => ({ ...f, league: e.target.value as 'futsal' | 'campo' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]">
                  <option value="futsal">Futsal</option>
                  <option value="campo">Campo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Grupo (opcional)</label>
                <input type="text" value={formData.group} onChange={e => setFormData(f => ({ ...f, group: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]" placeholder="Ex: A, B, C" maxLength={1} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Logo do Time</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Escolher arquivo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {formData.logo && (
                  <div className="flex items-center gap-2">
                    <img src={formData.logo} alt="Preview" className="w-12 h-12 object-contain rounded" />
                    <button type="button" onClick={() => setFormData(f => ({ ...f, logo: '' }))} className="text-sm text-red-600 hover:text-red-700">Remover</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="px-6 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors">{editingId ? 'Salvar Alterações' : 'Adicionar Time'}</button>
              <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTeamList('futsal')}
        {renderTeamList('campo')}
      </div>
    </div>
  );
}
