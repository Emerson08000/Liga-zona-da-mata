import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('lzmf_teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('lzmf_matches');
    return saved ? JSON.parse(saved) : [];
  });

  const [news, setNews] = useState<News[]>(() => {
    const saved = localStorage.getItem('lzmf_news');
    return saved ? JSON.parse(saved) : [];
  });

  const [champions, setChampions] = useState<Champion[]>(() => {
    const saved = localStorage.getItem('lzmf_champions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lzmf_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('lzmf_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('lzmf_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('lzmf_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('lzmf_champions', JSON.stringify(champions));
  }, [champions]);

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = { ...team, id: Date.now().toString() };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    setTeams(teams.map(team => team.id === id ? { ...team, ...updatedTeam } : team));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch = { ...match, id: Date.now().toString() };
    setMatches([...matches, newMatch]);
  };

  const updateMatch = (id: string, updatedMatch: Partial<Match>) => {
    setMatches(matches.map(match => match.id === id ? { ...match, ...updatedMatch } : match));
  };

  const deleteMatch = (id: string) => {
    setMatches(matches.filter(match => match.id !== id));
  };

  const addNews = (newsItem: Omit<News, 'id'>) => {
    const newNews = { ...newsItem, id: Date.now().toString() };
    setNews([newNews, ...news]);
  };

  const updateNews = (id: string, updatedNews: Partial<News>) => {
    setNews(news.map(item => item.id === id ? { ...item, ...updatedNews } : item));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  const addChampion = (champion: Omit<Champion, 'id'>) => {
    const newChampion = { ...champion, id: Date.now().toString() };
    setChampions([newChampion, ...champions]);
  };

  const updateChampion = (id: string, updatedChampion: Partial<Champion>) => {
    setChampions(champions.map(item => item.id === id ? { ...item, ...updatedChampion } : item));
  };

  const deleteChampion = (id: string) => {
    setChampions(champions.filter(item => item.id !== id));
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
