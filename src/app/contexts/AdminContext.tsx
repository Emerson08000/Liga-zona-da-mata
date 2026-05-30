import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  league: 'futsal' | 'campo';
  group?: string;
}

interface Champion {
  id: string;
  year: string;
  teamName: string;
  league: 'futsal' | 'campo';
  logo?: string;
}

interface Match {
  id: string;
  league: 'futsal' | 'campo';
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'finished';
}

interface News {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  league: 'futsal' | 'campo' | 'both';
  content?: string;
}

interface AdminContextType {
  teams: Team[];
  matches: Match[];
  news: News[];
  champions: Champion[];
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (id: string, match: Partial<Match>) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  addNews: (news: Omit<News, 'id'>) => Promise<void>;
  updateNews: (id: string, news: Partial<News>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addChampion: (champion: Omit<Champion, 'id'>) => Promise<void>;
  updateChampion: (id: string, champion: Partial<Champion>) => Promise<void>;
  deleteChampion: (id: string) => Promise<void>;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lzmf_admin_auth') === 'true';
  });

  // Funções de busca (Fetch)
  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) console.error('Erro ao buscar times:', error.message);
    else setTeams(data as Team[] || []);
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Erro ao buscar partidas:', error.message);
    } else if (data) {
      // Mapeamento caso o banco retorne null para scores opcionais, garantindo compatibilidade com o tipo Match
      const mappedMatches: Match[] = data.map((game: any) => ({
        id: game.id,
        league: game.league,
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        homeScore: game.homeScore ?? undefined,
        awayScore: game.awayScore ?? undefined,
        date: game.date,
        time: game.time,
        venue: game.venue,
        status: game.status,
      }));
      setMatches(mappedMatches);
    }
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) console.error('Erro ao buscar notícias:', error.message);
    else setNews(data as News[] || []);
  };

  const fetchChampions = async () => {
    const { data, error } = await supabase
      .from('champions')
      .select('*')
      .order('year', { ascending: false });

    if (error) console.error('Erro ao buscar campeões:', error.message);
    else setChampions(data as Champion[] || []);
  };

  // Carrega todos os dados ao iniciar o Provider
  useEffect(() => {
    fetchTeams();
    fetchMatches();
    fetchNews();
    fetchChampions();
  }, []);

  // OPERAÇÕES: TEAMS
  const addTeam = async (team: Omit<Team, 'id'>) => {
    const { error } = await supabase.from('teams').insert([team]);
    if (error) console.error('Erro ao adicionar time:', error.message);
    else await fetchTeams();
  };

  const updateTeam = async (id: string, updatedTeam: Partial<Team>) => {
    const { error } = await supabase.from('teams').update(updatedTeam).eq('id', id);
    if (error) console.error('Erro ao atualizar time:', error.message);
    else await fetchTeams();
  };

  const deleteTeam = async (id: string) => {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) console.error('Erro ao deletar time:', error.message);
    else await fetchTeams();
  };

  // OPERAÇÕES: MATCHES (Tabela 'games')
  const addMatch = async (match: Omit<Match, 'id'>) => {
    const { error } = await supabase.from('games').insert([match]);
    if (error) console.error('Erro ao adicionar partida:', error.message);
    else await fetchMatches();
  };

  const updateMatch = async (id: string, updatedMatch: Partial<Match>) => {
    const { error } = await supabase.from('games').update(updatedMatch).eq('id', id);
    if (error) console.error('Erro ao atualizar partida:', error.message);
    else await fetchMatches();
  };

  const deleteMatch = async (id: string) => {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) console.error('Erro ao deletar partida:', error.message);
    else await fetchMatches();
  };

  // OPERAÇÕES: NEWS
  const addNews = async (newsItem: Omit<News, 'id'>) => {
    const { error } = await supabase.from('news').insert([newsItem]);
    if (error) console.error('Erro ao adicionar notícia:', error.message);
    else await fetchNews();
  };

  const updateNews = async (id: string, updatedNews: Partial<News>) => {
    const { error } = await supabase.from('news').update(updatedNews).eq('id', id);
    if (error) console.error('Erro ao atualizar notícia:', error.message);
    else await fetchNews();
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) console.error('Erro ao deletar notícia:', error.message);
    else await fetchNews();
  };

  // OPERAÇÕES: CHAMPIONS (Tabela 'champions')
  const addChampion = async (champion: Omit<Champion, 'id'>) => {
    const { error } = await supabase.from('champions').insert([champion]);
    if (error) console.error('Erro ao adicionar campeão:', error.message);
    else await fetchChampions();
  };

  const updateChampion = async (id: string, updatedChampion: Partial<Champion>) => {
    const { error } = await supabase.from('champions').update(updatedChampion).eq('id', id);
    if (error) console.error('Erro ao atualizar campeão:', error.message);
    else await fetchChampions();
  };

  const deleteChampion = async (id: string) => {
    const { error } = await supabase.from('champions').delete().eq('id', id);
    if (error) console.error('Erro ao deletar campeão:', error.message);
    else await fetchChampions();
  };

  // AUTENTICAÇÃO (Mantida localmente conforme solicitado)
  const login = (password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'LZMF2019';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('lzmf_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lzmf_admin_auth');
  };

  return (
    <AdminContext.Provider
      value={{
        teams,
        matches,
        news,
        champions,
        addTeam,
        updateTeam,
        deleteTeam,
        addMatch,
        updateMatch,
        deleteMatch,
        addNews,
        updateNews,
        deleteNews,
        addChampion,
        updateChampion,
        deleteChampion,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}