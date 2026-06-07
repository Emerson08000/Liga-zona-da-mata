import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Lock } from 'lucide-react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4c2e] to-[#1a7a4a] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0f4c2e] rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Liga Zona da Mata de Futebol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Senha de Acesso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c2e] focus:border-transparent"
              placeholder="Digite a senha"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f4c2e] text-white py-3 rounded-lg hover:bg-[#1a7a4a] transition-colors"
          >
            Entrar
          </button>

          <div className="text-center">
            <a href="/" className="text-sm text-[#0f4c2e] hover:underline">
              Voltar para o site
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
