import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  league: 'futsal' | 'campo';
  group?: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  position?: string;
  birthDate?: string;
  rg?: string;
  cpf?: string;
}

export interface GameEvent {
  id: string;
  gameId: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'assist';
  teamId: string;
  playerName: string;
  minute?: number;
}

export interface Champion {
  id: string;
  year: string;
  teamName: string;
  league: 'futsal' | 'campo';
  logo?: string;
}

export interface Match {
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
  competition?: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  league: 'futsal' | 'campo' | 'both';
  content?: string;
}

// ─── NOVO: Competição com grupos ────────────────────────────────────────────
export interface Competition {
  id: string;
  name: string;
  league: 'futsal' | 'campo';
  season: string;          // ex: "2026"
  groups: CompetitionGroup[];
}

export interface CompetitionGroup {
  id: string;
  competitionId: string;
  name: string;            // ex: "A", "B", "Sub-15"
  teamIds: string[];
  advanceSpots: number;    // quantos times se classificam
}
// ────────────────────────────────────────────────────────────────────────────

interface AdminContextType {
  teams: Team[];
  matches: Match[];
  news: News[];
  champions: Champion[];
  players: Player[];
  gameEvents: GameEvent[];
  competitions: Competition[];
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
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  addGameEvent: (event: Omit<GameEvent, 'id'>) => void;
  deleteGameEvent: (id: string) => void;
  addCompetition: (comp: Omit<Competition, 'id'>) => void;
  updateCompetition: (id: string, comp: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function mapTeam(t: any): Team {
  return { id: String(t.id), name: t.name ?? '', shortName: t.abbreviation ?? '', logo: t.logo_url ?? undefined, league: t.league, group: t.team_group ?? undefined };
}

function mapMatch(g: any): Match {
  return {
    id: String(g.id), league: g.league,
    homeTeamId: g.home_team_id ?? '', awayTeamId: g.away_team_id ?? '',
    homeScore: g.home_score != null ? Number(g.home_score) : undefined,
    awayScore: g.away_score != null ? Number(g.away_score) : undefined,
    date: g.game_date ?? '', time: g.game_time ?? '', venue: g.location ?? '',
    status: g.status ?? 'scheduled', competition: g.competition ?? undefined,
  };
}

function mapNews(n: any): News {
  return { id: String(n.id), title: n.title ?? '', excerpt: n.summary ?? '', image: n.image_url ?? '', date: n.created_at ? String(n.created_at).slice(0, 10) : '', category: n.category ?? '', league: n.display_in ?? 'both', content: n.content ?? undefined };
}

function mapChampion(c: any): Champion {
  return { id: String(c.id), year: c.year ?? '', teamName: c.team_name ?? '', league: c.league, logo: c.logo ?? undefined };
}

function mapPlayer(p: any): Player {
  return { id: String(p.id), teamId: String(p.team_id), name: p.name ?? '', position: p.position ?? undefined, birthDate: p.birth_date ?? undefined, rg: p.rg ?? undefined, cpf: p.cpf ?? undefined };
}

function mapGameEvent(e: any): GameEvent {
  return { id: String(e.id), gameId: String(e.game_id), type: e.type, teamId: String(e.team_id), playerName: e.player_name ?? '', minute: e.minute ?? undefined };
}

function toTeamPayload(t: Omit<Team, 'id'>) { return { name: t.name, abbreviation: t.shortName, logo_url: t.logo ?? null, league: t.league, team_group: t.group ?? null }; }
function toTeamUpdatePayload(t: Partial<Team>) {
  const p: Record<string, unknown> = {};
  if (t.name !== undefined) p.name = t.name;
  if (t.shortName !== undefined) p.abbreviation = t.shortName;
  if (t.logo !== undefined) p.logo_url = t.logo;
  if (t.league !== undefined) p.league = t.league;
  if (t.group !== undefined) p.team_group = t.group;
  return p;
}

function toMatchPayload(m: Omit<Match, 'id'>) {
  return { league: m.league, home_team_id: m.homeTeamId, away_team_id: m.awayTeamId, home_score: m.homeScore ?? null, away_score: m.awayScore ?? null, game_date: m.date, game_time: m.time, location: m.venue, status: m.status, competition: m.competition ?? null };
}
function toMatchUpdatePayload(m: Partial<Match>) {
  const p: Record<string, unknown> = {};
  if (m.league !== undefined) p.league = m.league;
  if (m.homeTeamId !== undefined) p.home_team_id = m.homeTeamId;
  if (m.awayTeamId !== undefined) p.away_team_id = m.awayTeamId;
  if (m.homeScore !== undefined) p.home_score = m.homeScore;
  if (m.awayScore !== undefined) p.away_score = m.awayScore;
  if (m.date !== undefined) p.game_date = m.date;
  if (m.time !== undefined) p.game_time = m.time;
  if (m.venue !== undefined) p.location = m.venue;
  if (m.status !== undefined) p.status = m.status;
  if (m.competition !== undefined) p.competition = m.competition;
  return p;
}

function toNewsPayload(n: Omit<News, 'id'>) { return { title: n.title, summary: n.excerpt, image_url: n.image, category: n.category, display_in: n.league, content: n.content ?? null }; }
function toNewsUpdatePayload(n: Partial<News>) {
  const p: Record<string, unknown> = {};
  if (n.title !== undefined) p.title = n.title;
  if (n.excerpt !== undefined) p.summary = n.excerpt;
  if (n.image !== undefined) p.image_url = n.image;
  if (n.category !== undefined) p.category = n.category;
  if (n.league !== undefined) p.display_in = n.league;
  if (n.content !== undefined) p.content = n.content;
  return p;
}

function toChampionPayload(c: Omit<Champion, 'id'>) { return { year: c.year, team_name: c.teamName, league: c.league, logo: c.logo ?? null }; }
function toChampionUpdatePayload(c: Partial<Champion>) {
  const p: Record<string, unknown> = {};
  if (c.year !== undefined) p.year = c.year;
  if (c.teamName !== undefined) p.team_name = c.teamName;
  if (c.league !== undefined) p.league = c.league;
  if (c.logo !== undefined) p.logo = c.logo;
  return p;
}

function toPlayerPayload(pl: Omit<Player, 'id'>) {
  return { team_id: pl.teamId, name: pl.name, position: pl.position ?? null, birth_date: pl.birthDate ?? null, rg: pl.rg ?? null, cpf: pl.cpf ?? null };
}
function toPlayerUpdatePayload(pl: Partial<Player>) {
  const p: Record<string, unknown> = {};
  if (pl.name !== undefined) p.name = pl.name;
  if (pl.position !== undefined) p.position = pl.position;
  if (pl.birthDate !== undefined) p.birth_date = pl.birthDate;
  if (pl.rg !== undefined) p.rg = pl.rg;
  if (pl.cpf !== undefined) p.cpf = pl.cpf;
  return p;
}

function toGameEventPayload(e: Omit<GameEvent, 'id'>) {
  return { game_id: e.gameId, type: e.type, team_id: e.teamId, player_name: e.playerName, minute: e.minute ?? null };
}

// ─── Competitions são salvas em localStorage (sem tabela Supabase necessária) ─
const STORAGE_KEY = 'lzmf_competitions';

function loadCompetitions(): Competition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCompetitions(comps: Competition[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(comps)); } catch {}
}

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export function AdminProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>(loadCompetitions);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return localStorage.getItem('lzmf_admin_auth') === 'true'; } catch { return false; }
  });

  const fetchTeams = async () => { const { data, error } = await supabase.from('teams').select('*').order('name'); if (!error && data) setTeams(data.map(mapTeam)); };
  const fetchMatches = async () => { const { data, error } = await supabase.from('games').select('*').order('game_date'); if (!error && data) setMatches(data.map(mapMatch)); };
  const fetchNews = async () => { const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false }); if (!error && data) setNews(data.map(mapNews)); };
  const fetchChampions = async () => { const { data, error } = await supabase.from('champions').select('*').order('year', { ascending: false }); if (!error && data) setChampions(data.map(mapChampion)); };
  const fetchPlayers = async () => { const { data, error } = await supabase.from('players').select('*').order('name'); if (!error && data) setPlayers(data.map(mapPlayer)); };
  const fetchGameEvents = async () => { const { data, error } = await supabase.from('game_events').select('*').order('minute'); if (!error && data) setGameEvents(data.map(mapGameEvent)); };

  useEffect(() => { fetchTeams(); fetchMatches(); fetchNews(); fetchChampions(); fetchPlayers(); fetchGameEvents(); }, []);

  const addTeam = (t: Omit<Team, 'id'>): void => { supabase.from('teams').insert([toTeamPayload(t)]).then(() => fetchTeams()); };
  const updateTeam = (id: string, t: Partial<Team>): void => { supabase.from('teams').update(toTeamUpdatePayload(t)).eq('id', id).then(() => fetchTeams()); };
  const deleteTeam = (id: string): void => { supabase.from('teams').delete().eq('id', id).then(() => fetchTeams()); };

  const addMatch = (m: Omit<Match, 'id'>): void => { supabase.from('games').insert([toMatchPayload(m)]).then(() => fetchMatches()); };
  const updateMatch = (id: string, m: Partial<Match>): void => { supabase.from('games').update(toMatchUpdatePayload(m)).eq('id', id).then(() => fetchMatches()); };
  const deleteMatch = (id: string): void => { supabase.from('games').delete().eq('id', id).then(() => fetchMatches()); };

  const addNews = (n: Omit<News, 'id'>): void => { supabase.from('news').insert([toNewsPayload(n)]).then(() => fetchNews()); };
  const updateNews = (id: string, n: Partial<News>): void => { supabase.from('news').update(toNewsUpdatePayload(n)).eq('id', id).then(() => fetchNews()); };
  const deleteNews = (id: string): void => { supabase.from('news').delete().eq('id', id).then(() => fetchNews()); };

  const addChampion = (c: Omit<Champion, 'id'>): void => { supabase.from('champions').insert([toChampionPayload(c)]).then(() => fetchChampions()); };
  const updateChampion = (id: string, c: Partial<Champion>): void => { supabase.from('champions').update(toChampionUpdatePayload(c)).eq('id', id).then(() => fetchChampions()); };
  const deleteChampion = (id: string): void => { supabase.from('champions').delete().eq('id', id).then(() => fetchChampions()); };

  const addPlayer = (pl: Omit<Player, 'id'>): void => { supabase.from('players').insert([toPlayerPayload(pl)]).then(() => fetchPlayers()); };
  const updatePlayer = (id: string, pl: Partial<Player>): void => { supabase.from('players').update(toPlayerUpdatePayload(pl)).eq('id', id).then(() => fetchPlayers()); };
  const deletePlayer = (id: string): void => { supabase.from('players').delete().eq('id', id).then(() => fetchPlayers()); };

  const addGameEvent = (e: Omit<GameEvent, 'id'>): void => { supabase.from('game_events').insert([toGameEventPayload(e)]).then(() => fetchGameEvents()); };
  const deleteGameEvent = (id: string): void => { supabase.from('game_events').delete().eq('id', id).then(() => fetchGameEvents()); };

  // ─── Competitions (localStorage) ────────────────────────────────────────
  const addCompetition = (comp: Omit<Competition, 'id'>) => {
    const newComp: Competition = { ...comp, id: genId(), groups: comp.groups.map(g => ({ ...g, id: genId(), competitionId: '' })) };
    newComp.groups = newComp.groups.map(g => ({ ...g, competitionId: newComp.id }));
    const updated = [...competitions, newComp];
    setCompetitions(updated);
    saveCompetitions(updated);
  };

  const updateCompetition = (id: string, comp: Partial<Competition>) => {
    const updated = competitions.map(c => c.id === id ? { ...c, ...comp } : c);
    setCompetitions(updated);
    saveCompetitions(updated);
  };

  const deleteCompetition = (id: string) => {
    const updated = competitions.filter(c => c.id !== id);
    setCompetitions(updated);
    saveCompetitions(updated);
  };
  // ────────────────────────────────────────────────────────────────────────

  const login = (password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'LZMF2019';
    if (password === adminPassword) { localStorage.setItem('lzmf_admin_auth', 'true'); setIsAuthenticated(true); return true; }
    return false;
  };
  const logout = (): void => { localStorage.removeItem('lzmf_admin_auth'); setIsAuthenticated(false); };

  return (
    <AdminContext.Provider value={{
      teams, matches, news, champions, players, gameEvents, competitions,
      addTeam, updateTeam, deleteTeam,
      addMatch, updateMatch, deleteMatch,
      addNews, updateNews, deleteNews,
      addChampion, updateChampion, deleteChampion,
      addPlayer, updatePlayer, deletePlayer,
      addGameEvent, deleteGameEvent,
      addCompetition, updateCompetition, deleteCompetition,
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
