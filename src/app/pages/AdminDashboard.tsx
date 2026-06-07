import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { LogOut, Users, Calendar, Trophy, FileText, Award } from 'lucide-react';
import { TeamsManager } from '../components/admin/TeamsManager';
import { MatchesManager } from '../components/admin/MatchesManager';
import { NewsManager } from '../components/admin/NewsManager';
import { ChampionsManager } from '../components/admin/ChampionsManager';
import { StandingsManager } from '../components/admin/StandingsManager';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'standings' | 'news' | 'champions'>('teams');
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'teams' as const, label: 'Times', icon: Users },
    { id: 'matches' as const, label: 'Jogos', icon: Calendar },
    { id: 'standings' as const, label: 'Classificação', icon: Trophy },
    { id: 'news' as const, label: 'Notícias', icon: FileText },
    { id: 'champions' as const, label: 'Campeões', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0f4c2e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Painel Administrativo</h1>
              <p className="text-green-200 text-sm">Liga Zona da Mata de Futebol</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#0f4c2e] text-[#0f4c2e]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'teams' && <TeamsManager />}
          {activeTab === 'matches' && <MatchesManager />}
          {activeTab === 'standings' && <StandingsManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'champions' && <ChampionsManager />}
        </div>
      </div>
    </div>
  );
}
