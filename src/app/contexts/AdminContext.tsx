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
  competition?: string; // → competition no Supabase
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

function mapTeam(t: any): Team {
  return {
    id: String(t.id),
    name: t.name ?? '',
    shortName: t.abbreviation ?? '',
    logo: t.logo_url ?? undefined,
    league: t.league,
    group: t.team_group ?? undefined,
  };
}

function mapMatch(g: any): Match {
  return {
    id: String(g.id),
    league: g.league,
    homeTeamId: g.home_team_id ?? '',
    awayTeamId: g.away_team_id ?? '',
    homeScore: g.home_score !== null && g.home_score !== undefined ? Number(g.home_score) : undefined,
    awayScore: g.away_score !== null && g.away_score !== undefined ? Number(g.away_score) : undefined,
    date: g.game_date ?? '',
    time: g.game_time ?? '',
    venue: g.location ?? '',
    status: g.status ?? 'scheduled',
    competition: g.competition ?? undefined,
  };
}

function mapNews(n: any): News {
  return {
    id: String(n.id),
    title: n.title ?? '',
    excerpt: n.summary ?? '',
    image: n.image_url ?? '',
    date: n.created_at ? String(n.created_at).slice(0, 10) : '',
    category: n.category ?? '',
    league: n.display_in ?? 'both',
    content: n.content ?? undefined,
  };
}

function mapChampion(c: any): Champion {
  return {
    id: String(c.id),
    year: c.year ?? '',
    teamName: c.team_name ?? '',
    league: c.league,
    logo: c.logo ?? undefined,
  };
}

function toTeamPayload(team: Omit<Team, 'id'>) {
  return {
    name: team.name,
    abbreviation: team.shortName,
    logo_url: team.logo ?? null,
    league: team.league,
    team_group: team.group ?? null,
  };
}

function toTeamUpdatePayload(team: Partial<Team>) {
  const payload: Record<string, unknown> = {};
  if (team.name !== undefined) payload.name = team.name;
  if (team.shortName !== undefined) payload.abbreviation = team.shortName;
  if (team.logo !== undefined) payload.logo_url = team.logo;
  if (team.league !== undefined) payload.league = team.league;
  if (team.group !== undefined) payload.team_group = team.group;
  return payload;
}

function toMatchPayload(match: Omit<Match, 'id'>) {
  return {
    league: match.league,
    home_team_id: match.homeTeamId,
    away_team_id: match.awayTeamId,
    home_score: match.homeScore ?? null,
    away_score: match.awayScore ?? null,
    game_date: match.date,
    game_time: match.time,
    location: match.venue,
    status: match.status,
    competition: match.competition ?? null,
  };
}

function toMatchUpdatePayload(match: Partial<Match>) {
  const payload: Record<string, unknown> = {};
  if (match.league !== undefined) payload.league = match.league;
  if (match.homeTeamId !== undefined) payload.home_team_id = match.homeTeamId;
  if (match.awayTeamId !== undefined) payload.away_team_id = match.awayTeamId;
  if (match.homeScore !== undefined) payload.home_score = match.homeScore;
  if (match.awayScore !== undefined) payload.away_score = match.awayScore;
  if (match.date !== undefined) payload.game_date = match.date;
  if (match.time !== undefined) payload.game_time = match.time;
  if (match.venue !== undefined) payload.location = match.venue;
  if (match.status !== undefined) payload.status = match.status;
  if (match.competition !== undefined) payload.competition = match.competition;
  return payload;
}

function toNewsPayload(news: Omit<News, 'id'>) {
  return {
    title: news.title,
    summary: news.excerpt,
    image_url: news.image,
    category: news.category,
    display_in: news.league,
    content: news.content ?? null,
  };
}

function toNewsUpdatePayload(news: Partial<News>) {
  const payload: Record<string, unknown> = {};
  if (news.title !== undefined) payload.title = news.title;
  if (news.excerpt !== undefined) payload.summary = news.excerpt;
  if (news.image !== undefined) payload.image_url = news.image;
  if (news.category !== undefined) payload.category = news.category;
  if (news.league !== undefined) payload.display_in = news.league;
  if (news.content !== undefined) payload.content = news.content;
  return payload;
}

function toChampionPayload(champion: Omit<Champion, 'id'>) {
  return {
    year: champion.year,
    team_name: champion.teamName,
    league: champion.league,
    logo: champion.logo ?? null,
  };
}

function toChampionUpdatePayload(champion: Partial<Champion>) {
  const payload: Record<string, unknown> = {};
  if (champion.year !== undefined) payload.year = champion.year;
  if (champion.teamName !== undefined) payload.team_name = champion.teamName;
  if (champion.league !== undefined) payload.league = champion.league;
  if (champion.logo !== undefined) payload.logo = champion.logo;
  return payload;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return localStorage.getItem('lzmf_admin_auth') === 'true'; } catch { return false; }
  });

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
    if (!error && data) setTeams(data.map(mapTeam));
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('games').select('*').order('game_date', { ascending: true });
    if (!error && data) setMatches(data.map(mapMatch));
  };

  const fetchNews = async () => {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (!error && data) setNews(data.map(mapNews));
  };

  const fetchChampions = async () => {
    const { data, error } = await supabase.from('champions').select('*').order('year', { ascending: false });
    if (!error && data) setChampions(data.map(mapChampion));
  };

  useEffect(() => {
    fetchTeams(); fetchMatches(); fetchNews(); fetchChampions();
  }, []);

  const addTeam = (team: Omit<Team, 'id'>): void => { supabase.from('teams').insert([toTeamPayload(team)]).then(() => fetchTeams()); };
  const updateTeam = (id: string, u: Partial<Team>): void => { supabase.from('teams').update(toTeamUpdatePayload(u)).eq('id', id).then(() => fetchTeams()); };
  const deleteTeam = (id: string): void => { supabase.from('teams').delete().eq('id', id).then(() => fetchTeams()); };

  const addMatch = (match: Omit<Match, 'id'>): void => { supabase.from('games').insert([toMatchPayload(match)]).then(() => fetchMatches()); };
  const updateMatch = (id: string, u: Partial<Match>): void => { supabase.from('games').update(toMatchUpdatePayload(u)).eq('id', id).then(() => fetchMatches()); };
  const deleteMatch = (id: string): void => { supabase.from('games').delete().eq('id', id).then(() => fetchMatches()); };

  const addNews = (newsItem: Omit<News, 'id'>): void => { supabase.from('news').insert([toNewsPayload(newsItem)]).then(() => fetchNews()); };
  const updateNews = (id: string, u: Partial<News>): void => { supabase.from('news').update(toNewsUpdatePayload(u)).eq('id', id).then(() => fetchNews()); };
  const deleteNews = (id: string): void => { supabase.from('news').delete().eq('id', id).then(() => fetchNews()); };

  const addChampion = (champion: Omit<Champion, 'id'>): void => { supabase.from('champions').insert([toChampionPayload(champion)]).then(() => fetchChampions()); };
  const updateChampion = (id: string, u: Partial<Champion>): void => { supabase.from('champions').update(toChampionUpdatePayload(u)).eq('id', id).then(() => fetchChampions()); };
  const deleteChampion = (id: string): void => { supabase.from('champions').delete().eq('id', id).then(() => fetchChampions()); };

  const login = (password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'LZMF2019';
    if (password === adminPassword) {
      localStorage.setItem('lzmf_admin_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    localStorage.removeItem('lzmf_admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{
      teams, matches, news, champions,
      addTeam, updateTeam, deleteTeam,
      addMatch, updateMatch, deleteMatch,
      addNews, updateNews, deleteNews,
      addChampion, updateChampion, deleteChampion,
      isAuthenticated, login, logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
