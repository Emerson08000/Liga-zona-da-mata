import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';

export function NewsManager() {
  const { news, addNews, updateNews, deleteNews } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    image: '',
    category: '',
    league: 'both' as 'futsal' | 'campo' | 'both',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newsData = {
      ...formData,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    };

    if (editingId) {
      updateNews(editingId, newsData);
      setEditingId(null);
    } else {
      addNews(newsData);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      image: '',
      category: '',
      league: 'both',
      content: '',
    });
  };

  const handleEdit = (newsItem: any) => {
    setEditingId(newsItem.id);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      image: newsItem.image,
      category: newsItem.category,
      league: newsItem.league,
      content: newsItem.content || '',
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">Gerenciar Notícias</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f4c2e] text-white rounded-lg hover:bg-[#1a7a4a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Notícia
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">
              {editingId ? 'Editar Notícia' : 'Nova Notícia'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Título da Notícia</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                placeholder="Ex: Time vence partida decisiva"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Resumo</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] h-20"
                placeholder="Breve descrição da notícia..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Conteúdo Completo (Opcional)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] h-32"
                placeholder="Conteúdo completo da notícia..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                  placeholder="Ex: Resultados, Destaques"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Exibir em</label>
                <select
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value as 'futsal' | 'campo' | 'both' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e]"
                >
                  <option value="both">Futsal e Campo</option>
                  <option value="futsal">Apenas Futsal</option>
                  <option value="campo">Apenas Campo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Imagem de Destaque</label>
              <div className="flex items-start gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Escolher imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <div className="flex items-start gap-2">
                    <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
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
                {editingId ? 'Salvar Alterações' : 'Publicar Notícia'}
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
        {news.length > 0 ? (
          news.map((newsItem) => (
            <div key={newsItem.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {newsItem.image ? (
                  <img src={newsItem.image} alt={newsItem.title} className="w-32 h-20 object-cover rounded flex-shrink-0" />
                ) : (
                  <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg text-gray-900 mb-1 truncate">{newsItem.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-[#0f4c2e] text-white text-xs rounded">
                          {newsItem.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {newsItem.league === 'both' ? 'Futsal & Campo' : newsItem.league === 'futsal' ? 'Futsal' : 'Campo'}
                        </span>
                        <span className="text-xs text-gray-500">{newsItem.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteNews(newsItem.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{newsItem.excerpt}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Nenhuma notícia publicada ainda</p>
            <p className="text-sm mt-2">Clique em "Nova Notícia" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
