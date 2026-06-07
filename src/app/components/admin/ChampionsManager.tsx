import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit, Trash2, Upload, X, Trophy } from 'lucide-react';

export function ChampionsManager() {
  const { champions, addChampion, updateChampion, deleteChampion } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: '',
    teamName: '',
    league: 'futsal' as 'futsal' | 'campo',
    logo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateChampion(editingId, formData);
      setEditingId(null);
    } else {
      addChampion(formData);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      year: '',
      teamName: '',
      league: 'futsal',
      logo: '',
    });
  };

  const handleEdit = (champion: any) => {
    setEditingId(champion.id);
    setFormData({
      year: champion.year,
      teamName: champion.teamName,
      league: champion.league,
      logo: champion.logo || '',
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
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

  const futsalChampions = champions.filter(c => c.league === 'futsal').sort((a, b) => b.year.localeCompare(a.year));
  const campoChampions = champions.filter(c => c.league === 'campo').sort((a, b) => b.year.localeCompare(a.year));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Campeões Históricos</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Campeão
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">
              {editingId ? 'Editar Campeão' : 'Novo Campeão'}
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
                <label className="block text-sm text-gray-700 mb-2">Ano da Temporada</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: 2025, 2024/25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome do Time Campeão</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: EC Viçosa"
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm text-gray-700 mb-2">Logo do Time (opcional)</label>
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
                {editingId ? 'Salvar Alterações' : 'Adicionar Campeão'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Campeões de Futsal
          </h3>
          <div className="space-y-2">
            {futsalChampions.map((champion) => (
              <div key={champion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {champion.logo ? (
                    <img src={champion.logo} alt={champion.teamName} className="w-10 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-gray-900 font-medium">{champion.teamName}</div>
                    <div className="text-sm text-gray-500">Temporada {champion.year}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(champion)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteChampion(champion.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            {futsalChampions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum campeão de futsal cadastrado</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Campeões de Campo
          </h3>
          <div className="space-y-2">
            {campoChampions.map((champion) => (
              <div key={champion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {champion.logo ? (
                    <img src={champion.logo} alt={champion.teamName} className="w-10 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-gray-900 font-medium">{champion.teamName}</div>
                    <div className="text-sm text-gray-500">Temporada {champion.year}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(champion)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteChampion(champion.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            {campoChampions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum campeão de campo cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
