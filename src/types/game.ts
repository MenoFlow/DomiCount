export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Game {
  id: string;
  players: Player[];
  targetScore: number;
  createdAt: string;
  updatedAt: string;
  rounds: Round[];
}

export interface Round {
  id: string;
  winnerId: string;
  pointsGained: number;
  losersPoints: { playerId: string; points: number }[];
  timestamp: string;
}

export interface GameSummary {
  id: string;
  playerNames: string[];
  scores: number[];
  createdAt: string;
  updatedAt: string;
}
