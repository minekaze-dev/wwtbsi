export interface Question {
  q: string;
  options: string[];
  answerIndex: number;
  difficulty: string;
  hiddenOptions?: number[];
  category: string;
}

export interface PrizeTier {
  step: number;
  prize: number;
}

export interface Lifelines {
  fifty: boolean;
  audience: boolean;
  chat: boolean;
}

export type GameState = 'LOADING' | 'WELCOME' | 'PLAYING' | 'GAME_OVER' | 'ERROR';

export type GameMode = 'NORMAL' | 'HARD';

export interface AudiencePollResult {
  type: 'audience';
  poll: number[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface ChatLifelineResult {
  type: 'chat';
  messages: ChatMessage[];
  isLoading: boolean;
}

export type LifelineResult = AudiencePollResult | ChatLifelineResult | null;

export interface LeaderboardEntry {
  name: string;
  score: number; // Final prize
  points: number;
  time: number; // in seconds
  avatar: string;
}
