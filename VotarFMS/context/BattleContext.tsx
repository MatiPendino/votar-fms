import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { 
  BattleState, League, LeagueConfig, MC, Participant, RoundId, RoundScore
} from "../types";
import { buildLeagueConfig } from "../data/scoring";
import { addExtras, updateScore } from "../utils/battleContextHelpers";

interface StartBattlePayload {
  league: League;
  firstMc: MC;
  secondMc: MC;
}

interface BattleContextValue {
  battle: BattleState | null;
  config: LeagueConfig | null;
  startBattle: (payload: StartBattlePayload) => void;
  setScore: (
    roundId: RoundId,
    participant: Participant,
    categoryId: string,
    value: number
  ) => void;
  toggleExtra: (roundId: RoundId, participant: Participant, index: number) => void;
  goToNextRound: () => void;
  goToPreviousRound: () => void;
  resetBattle: () => void;
}

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

const createInitialRoundScores = (config: LeagueConfig): Record<RoundId, RoundScore> => {
  const scores: Record<string, RoundScore> = {};

  config.rounds.forEach((round) => {
    const baseFirst: Record<string, number> = {};
    const baseSecond: Record<string, number> = {};
    round.categories.forEach((category) => {
      baseFirst[category.id] = 0;
      baseSecond[category.id] = 0;
    });

    const extras: RoundScore["extras"] = {};
    if (round.extras?.first) {
      extras.first = Array.from({ length: round.extras.first.count }, () => false);
    }
    if (round.extras?.second) {
      extras.second = Array.from({ length: round.extras.second.count }, () => false);
    }

    scores[round.id] = {
      first: baseFirst,
      second: baseSecond,
      ...(extras.first || extras.second ? { extras } : {}),
    };
  });

  return scores;
};

export const BattleProvider = ({ children }: {children: React.ReactNode}) => {
  const [battle, setBattle] = useState<BattleState | null>(null);

  const config = useMemo<LeagueConfig | null>(() => {
    if (!battle) return null;
    return buildLeagueConfig(battle.leagueId, battle.leagueName);
  }, [battle]);

  const startBattle = useCallback(({ league, firstMc, secondMc }: StartBattlePayload) => {
    const leagueConfig: LeagueConfig = buildLeagueConfig(league.slug, league.name);
    const roundScores: Record<RoundId, RoundScore> = createInitialRoundScores(leagueConfig);

    setBattle({
      leagueId: league.slug,
      leagueName: league.name,
      leagueDatabaseId: league.id,
      firstMc: firstMc.aka,
      secondMc: secondMc.aka,
      firstMcId: firstMc.id,
      secondMcId: secondMc.id,
      currentRoundIndex: 0,
      roundScores,
      startedAt: new Date().toISOString(),
    });
  }, []);

  const setScore = useCallback((
    roundId: RoundId, participant: Participant, categoryId: string, value: number
  ) => {
    setBattle(
      (prev) => (!prev ? prev : updateScore(prev, roundId, participant, categoryId, value))
    );
  }, []);

  const toggleExtra = useCallback((roundId: RoundId, participant: Participant, index: number) => {
    setBattle((prev) => (!prev ? prev : addExtras(prev, roundId, participant, index)));
  }, []);

  const goToNextRound = useCallback(() => {
    setBattle((prev) => {
      if (!prev || !config) {
        return prev;
      }
      const maxIndex: number = config.rounds.length;
      return {
        ...prev,
        currentRoundIndex: Math.min(prev.currentRoundIndex + 1, maxIndex),
      };
    });
  }, [config]);

  const goToPreviousRound = useCallback(() => {
    setBattle((prev) => {
      if (!prev) return prev;
      
      return {
        ...prev,
        currentRoundIndex: Math.max(prev.currentRoundIndex - 1, 0),
      };
    });
  }, []);

  const resetBattle = useCallback(() => setBattle(null), []);

  const value = useMemo<BattleContextValue>(
    () => ({
      battle, config, startBattle, setScore, toggleExtra, goToNextRound,
      goToPreviousRound, resetBattle
    }),
    [
      battle, config, startBattle, setScore, toggleExtra, goToNextRound, 
      goToPreviousRound, resetBattle
    ]
  );

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = (): BattleContextValue => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error("useBattle must be used within a BattleProvider");
  }
  return context;
};