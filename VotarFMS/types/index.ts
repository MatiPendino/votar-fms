export type Participant = "first" | "second";
export type ModalType = "league" | "first" | "second" | null;

export type RoundId = (
  "easy" | "hard" | "themes1" | "themes2" | "random" | "blood1" | "blood2" | "deluxe"
);

export interface ScoreCategory {
  id: string;
  label: string;
  step?: number;
  max?: number;
}

export interface ExtraConfig {
  count: number;
  label?: string;
  points?: number;
}

export interface RoundDefinition {
  id: RoundId;
  label: string;
  description?: string;
  categories: ScoreCategory[];
  step?: number;
  max?: number;
  extras?: {
    first?: ExtraConfig;
    second?: ExtraConfig;
  };
}

export interface SummarySection {
  id: string;
  label: string;
  rounds: RoundId[];
}

export interface LeagueConfig {
  id: string;
  name: string;
  rounds: RoundDefinition[];
  summary: SummarySection[];
  winnerThreshold: number;
  allowSave: boolean;
}

export interface League {
  id: number;
  name: string;
  slug: string;
}

export interface MC {
  id: number;
  aka: string;
  league_id: number;
}

export interface Standing {
  id: number;
  points: number;
  punctuation: number;
  league_id: number;
  mc: MC | null;
}

export interface RoundScore {
  first: Record<string, number>;
  second: Record<string, number>;
  extras?: {
    first?: boolean[];
    second?: boolean[];
  };
}

export interface BattleState {
  leagueId: string;
  leagueName: string;
  leagueDatabaseId: number;
  firstMc: string;
  secondMc: string;
  firstMcId: number;
  secondMcId: number;
  currentRoundIndex: number;
  roundScores: Record<RoundId, RoundScore>;
  startedAt: string;
}

export interface SummaryRow {
  id: string;
  label: string;
  first: number;
  second: number;
}

export interface BattleResult {
  leagueId: string;
  leagueName: string;
  leagueDatabaseId: number;
  firstMc: string;
  secondMc: string;
  firstMcId: number;
  secondMcId: number;
  summary: SummaryRow[];
  totals: {
    first: number;
    second: number;
  };
  winner: string;
  margin: number;
  createdAt: string;
}

export interface BattleRecord extends BattleResult {
  id: string;
}

export interface Category {
  id: string;
  label: string;
}