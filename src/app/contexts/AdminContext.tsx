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
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addNews: (newsItem: Omit<News, 'id'>) => void;
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
  
  // CORREÇÃO DA SENHA: Busca rigorosamente o estado real do localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lzmf_admin_auth') === 'true';
  });

  // Métodos assíncronos internos de busca mapeando camelCase -> snake_case
  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });
    
    if (!error && data) {
      const mapped = data.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        shortName: t.short_name || t.shortName,
        logo: t.logo,
        league: t.league,
        group: t.group
      }));
      setTeams(mapped);
    }
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      const mapped = data.map((game: any) => ({
        id: String(game.id),
        league: game.league,
        homeTeamId: game.home_team_id || game.homeTeamId,
        awayTeamId: game.away_team_id || game.awayTeamId,
        homeScore: game.home_score !== null ? game.home_score : (game.homeScore ?? undefined),
        awayScore: game.away_score !== null ? game.away_score : (game.awayScore ?? undefined),
        date: game.date,
        time: game.time,
        venue: game.venue,
        status: game.status,
      }));
      setMatches(mapped);
    }
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setNews(data as News[]);
    }
  };

  const fetchChampions = async () => {
    const { data, error } = await supabase
      .from('champions')
      .select('*')
      .order('year', { ascending: false });

    if (!error && data) {
      const mapped = data.map((c: any) => ({
        id: String(c.id),
        year: c.year,
        teamName: c.team_name || c.teamName,
        league: c.league,
        logo: c.logo
      }));
      setChampions(mapped);
    }
  };

  // Carrega os dados vindos do banco de dados na inicialização
  useEffect(() => {
    fetchTeams();
    fetchMatches();
    fetchNews();
    fetchChampions();
  }, []);

  // OPERAÇÕES: TEAMS
  const addTeam = (team: Omit<Team, 'id'>) => {
    const payload = {
      name: team.name,
      short_name: team.shortName,
      logo: team.logo,
      league: team.league,
      group: team.group
    };
    supabase.from('teams').insert([payload]).then(() => {
      fetchTeams();
    });
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    const payload: any = {};
    if (updatedTeam.name !== undefined) payload.name = updatedTeam.name;
    if (updatedTeam.shortName !== undefined) payload.short_name = updatedTeam.shortName;
    if (updatedTeam.logo !== undefined) payload.logo = updatedTeam.logo;
    if (updatedTeam.league !== undefined) payload.league = updatedTeam.league;
    if (updatedTeam.group !== undefined) payload.group = updatedTeam.group;

    supabase.from('teams').update(payload).eq('id', id).then(() => {
      fetchTeams();
    });
  };

  const deleteTeam = (id: string) => {
    supabase.from('teams').delete().eq('id', id).then(() => {
      fetchTeams();
    });
  };

  // OPERAÇÕES: MATCHES (Tabela 'games')
  const addMatch = (match: Omit<Match, 'id'>) => {
    const payload = {
      league: match.league,
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      home_score: match.homeScore,
      away_score: match.awayScore,
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status
    };
    supabase.from('games').insert([payload]).then(() => {
      fetchMatches();
    });
  };

  const updateMatch = (id: string, updatedMatch: Partial<Match>) => {
    const payload: any = {};
    if (updatedMatch.league !== undefined) payload.league = updatedMatch.league;
    if (updatedMatch.homeTeamId !== undefined) payload.home_team_id = updatedMatch.homeTeamId;
    if (updatedMatch.awayTeamId !== undefined) payload.away_team_id = updatedMatch.awayTeamId;
    if (updatedMatch.homeScore !== undefined) payload.home_score = updatedMatch.homeScore;
    if (updatedMatch.awayScore !== undefined) payload.away_score = updatedMatch.awayScore;
    if (updatedMatch.date !== undefined) payload.date = updatedMatch.date;
    if (updatedMatch.time !== undefined) payload.time = updatedMatch.time;
    if (updatedMatch.venue !== undefined) payload.venue = updatedMatch.venue;
    if (updatedMatch.status !== undefined) payload.status = updatedMatch.status;

    supabase.from('games').update(payload).eq('id', id).then(() => {
      fetchMatches();
    });
  };

  const deleteMatch = (id: string) => {
    supabase.from('games').delete().eq('id', id).then(() => {
      fetchMatches();
    });
  };

  // OPERAÇÕES: NEWS
  const addNews = (newsItem: Omit<News, 'id'>) => {
    supabase.from('news').insert([newsItem]).then(() => {
      fetchNews();
    });
  };

  const updateNews = (id: string, updatedNews: Partial<News>) => {
    supabase.from('news').update(updatedNews).eq('id', id).then(() => {
      fetchNews();
    });
  };

  const deleteNews = (id: string) => {
    supabase.from('news').delete().eq('id', id).then(() => {
      fetchNews();
    });
  };

  // OPERAÇÕES: CHAMPIONS
  const addChampion = (champion: Omit<Champion, 'id'>) => {
    const payload = {
      year: champion.year,
      team_name: champion.teamName,
      league: champion.league,
      logo: champion.logo
    };
    supabase.from('champions').insert([payload]).then(() => {
      fetchChampions();
    });
  };

  const updateChampion = (id: string, updatedChampion: Partial<Champion>) => {
    const payload: any = {};
    if (updatedChampion.year !== undefined) payload.year = updatedChampion.year;
    if (updatedChampion.teamName !== undefined) payload.team_name = updatedChampion.teamName;
    if (updatedChampion.league !== undefined) payload.league = updatedChampion.league;
    if (updatedChampion.logo !== undefined) payload.logo = updatedChampion.logo;

    supabase.from('champions').update(payload).eq('id', id).then(() => {
      fetchChampions();
    });
  };

  const deleteChampion = (id: string) => {
    supabase.from('champions').delete().eq('id', id).then(() => {
      fetchChampions();
    });
  };

  // LOGIN & LOGOUT (Autenticação local segura)
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