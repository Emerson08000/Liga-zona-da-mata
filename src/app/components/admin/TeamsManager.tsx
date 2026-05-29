import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

export function TeamsManager() {
  const { teams, addTeam, updateTeam, deleteTeam } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    logo: '',
    league: 'futsal' as 'futsal' | 'campo',
    group: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTeam(editingId, formData);
      setEditingId(null);
    } else {
      addTeam(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', shortName: '', logo: '', league: 'futsal', group: '' });
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setFormData({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || '',
      league: team.league,
      group: team.group || '',
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', shortName: '', logo: '', league: 'futsal', group: '' });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Gerenciar Times</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Time
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">
              {editingId ? 'Editar Time' : 'Novo Time'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome do Time</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: EC Viçosa"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Abreviação</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: VIC"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Liga</label>
                <select
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value as 'futsal' | 'campo' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                >
                  <option value="futsal">Futsal</option>
                  <option value="campo">Campo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Grupo (opcional)</label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: A, B, C"
                  maxLength={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Logo do Time</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Escolher arquivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.logo && (
                  <div className="flex items-center gap-2">
                    <img src={formData.logo} alt="Preview" className="w-12 h-12 object-contain rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logo: '' })}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors"
              >
                {editingId ? 'Salvar Alterações' : 'Adicionar Time'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-600 mb-3">Times de Futsal</h3>
            <div className="space-y-2">
              {teams.filter(t => t.league === 'futsal').map((team) => (
                <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                        {team.shortName}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {team.shortName}
                        {team.group && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Grupo {team.group}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              {teams.filter(t => t.league === 'futsal').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">Nenhum time de futsal cadastrado</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600 mb-3">Times de Campo</h3>
            <div className="space-y-2">
              {teams.filter(t => t.league === 'campo').map((team) => (
                <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                        {team.shortName}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {team.shortName}
                        {team.group && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Grupo {team.group}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              {teams.filter(t => t.league === 'campo').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">Nenhum time de campo cadastrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
