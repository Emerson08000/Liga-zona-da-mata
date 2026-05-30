import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Usando o caminho relativo correto partindo de src/app/contexts para src/lib
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
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addNews: (news: Omit<News, 'id'>) => void;
  updateNews: (id: string, news: Partial<News>) => void;
  deleteNews: (id: string) => void;
  addChampion: (champion: Omit<Champion, 'id'>) => void;
  updateChampion: (id: string, champion: Partial<Champion>) => void;
  deleteChampion: (id: string) => void;
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

  // Buscar dados
  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
    if (!error && data) setTeams(data as Team[]);
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('games').select('*').order('date', { ascending: true });
    if (!error && data) {
      const mapped = data.map((game: any) => ({
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
      setMatches(mapped);
    }
  };

  const fetchNews = async () => {
    const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
    if (!error && data) setNews(data as News[]);
  };

  const fetchChampions = async () => {
    const { data, error } = await supabase.from('champions').select('*').order('year', { ascending: false });
    if (!error && data) setChampions(data as Champion[]);
  };

  useEffect(() => {
    fetchTeams();
    fetchMatches();
    fetchNews();
    fetchChampions();
  }, []);

  // OPERAÇÕES TEAMS
  const addTeam = (team: Omit<Team, 'id'>) => {
    supabase.from('teams').insert([team]).then(() => fetchTeams());
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    supabase.from('teams').update(updatedTeam).eq('id', id).then(() => fetchTeams());
  };

  const deleteTeam = (id: string) => {
    supabase.from('teams').delete().eq('id', id).then(() => fetchTeams());
  };

  // OPERAÇÕES MATCHES (GAMES)
  const addMatch = (match: Omit<Match, 'id'>) => {
    supabase.from('games').insert([match]).then(() => fetchMatches());
  };

  const updateMatch = (id: string, updatedMatch: Partial<Match>) => {
    supabase.from('games').update(updatedMatch).eq('id', id).then(() => fetchMatches());
  };

  const deleteMatch = (id: string) => {
    supabase.from('games').delete().eq('id', id).then(() => fetchMatches());
  };

  // OPERAÇÕES NEWS
  const addNews = (newsItem: Omit<News, 'id'>) => {
    supabase.from('news').insert([newsItem]).then(() => fetchNews());
  };

  const updateNews = (id: string, updatedNews: Partial<News>) => {
    supabase.from('news').update(updatedNews).eq('id', id).then(() => fetchNews());
  };

  const deleteNews = (id: string) => {
    supabase.from('news').delete().eq('id', id).then(() => fetchNews());
  };

  // OPERAÇÕES CHAMPIONS
  const addChampion = (champion: Omit<Champion, 'id'>) => {
    supabase.from('champions').insert([champion]).then(() => fetchChampions());
  };

  const updateChampion = (id: string, updatedChampion: Partial<Champion>) => {
    supabase.from('champions').update(updatedChampion).eq('id', id).then(() => fetchChampions());
  };

  const deleteChampion = (id: string) => {
    supabase.from('champions').delete().eq('id', id).then(() => fetchChampions());
  };

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