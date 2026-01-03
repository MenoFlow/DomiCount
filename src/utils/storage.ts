import { Game, GameSummary } from "@/types/game";

const GAMES_KEY = "domino_games";
const CURRENT_GAME_KEY = "domino_current_game";

export const saveGame = (game: Game): void => {
  const games = getGames();
  const existingIndex = games.findIndex((g) => g.id === game.id);
  
  if (existingIndex >= 0) {
    games[existingIndex] = game;
  } else {
    games.push(game);
  }
  
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
};

export const getGames = (): Game[] => {
  const data = localStorage.getItem(GAMES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getGame = (id: string): Game | null => {
  const games = getGames();
  return games.find((g) => g.id === id) || null;
};

export const deleteGame = (id: string): void => {
  const games = getGames().filter((g) => g.id !== id);
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
};

export const deleteMultipleGames = (ids: string[]): void => {
  const games = getGames().filter((g) => !ids.includes(g.id));
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
};

export const setCurrentGame = (gameId: string | null): void => {
  if (gameId) {
    localStorage.setItem(CURRENT_GAME_KEY, gameId);
  } else {
    localStorage.removeItem(CURRENT_GAME_KEY);
  }
};

export const getCurrentGameId = (): string | null => {
  return localStorage.getItem(CURRENT_GAME_KEY);
};

export const getGamesSummary = (): GameSummary[] => {
  const games = getGames();
  return games.map((game) => ({
    id: game.id,
    playerNames: game.players.map((p) => p.name),
    scores: game.players.map((p) => p.score),
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  }));
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
