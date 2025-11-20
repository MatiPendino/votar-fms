import { buildLeagueConfig } from "../data/scoring";
import { 
  BattleResult, BattleState, LeagueConfig, RoundId, RoundScore, SummaryRow 
} from "../types";

const roundTotals = (
  battle: BattleState,
  config: LeagueConfig
): Record<RoundId, { first: number; second: number }> => {
  const totals: Partial<Record<RoundId, { first: number; second: number }>> = {};

  config.rounds.forEach((round) => {
    const score: RoundScore = battle.roundScores[round.id];
    if (!score) {
      totals[round.id] = { first: 0, second: 0 };
      return;
    }

    const sumValues = (values: Record<string, number>): number =>
      Object.values(values).reduce((acc, value) => acc + value, 0);

    let firstTotal: number = sumValues(score.first);
    let secondTotal: number = sumValues(score.second);

    if (round.extras?.first && score.extras?.first) {
      const points: number = round.extras.first.points ?? 1;
      firstTotal += score.extras.first.filter(Boolean).length * points;
    }

    if (round.extras?.second && score.extras?.second) {
      const points: number = round.extras.second.points ?? 1;
      secondTotal += score.extras.second.filter(Boolean).length * points;
    }

    totals[round.id] = {
      first: Math.round(firstTotal * 10) / 10,
      second: Math.round(secondTotal * 10) / 10,
    };
  });

  return totals as Record<RoundId, { first: number; second: number }>;
};

const aggregateSummary = (
  battle: BattleState,
  config: LeagueConfig
): { summary: SummaryRow[]; totalFirst: number; totalSecond: number } => {
  const totalsByRound = roundTotals(battle, config);

  const summary: SummaryRow[] = config.summary.map((section) => {
    const first: number = (
      section.rounds.reduce((acc, roundId) => acc + (totalsByRound[roundId]?.first ?? 0), 0)
    );
    const second: number = (
      section.rounds.reduce((acc, roundId) => acc + (totalsByRound[roundId]?.second ?? 0), 0)
    );

    return {
      id: section.id,
      label: section.label,
      first: Math.round(first * 10) / 10,
      second: Math.round(second * 10) / 10,
    };
  });

  const totalFirst: number = summary.reduce((acc, row) => acc + row.first, 0);
  const totalSecond: number = summary.reduce((acc, row) => acc + row.second, 0);

  return {
    summary,
    totalFirst: Math.round(totalFirst * 10) / 10,
    totalSecond: Math.round(totalSecond * 10) / 10,
  };
};

export const calculateBattleResult = (battle: BattleState): BattleResult => {
  const config: LeagueConfig = buildLeagueConfig(battle.leagueId, battle.leagueName);
  const { summary, totalFirst, totalSecond } = aggregateSummary(battle, config);
  const margin: number = Math.abs(totalFirst - totalSecond);

  let winner: string = "Réplica";
  if (totalFirst > totalSecond + config.winnerThreshold) {
    winner = battle.firstMc;
  } else if (totalSecond > totalFirst + config.winnerThreshold) {
    winner = battle.secondMc;
  }

  return {
    leagueId: battle.leagueId,
    leagueName: config.name,
    leagueDatabaseId: battle.leagueDatabaseId,
    firstMc: battle.firstMc,
    secondMc: battle.secondMc,
    firstMcId: battle.firstMcId,
    secondMcId: battle.secondMcId,
    summary,
    totals: {
      first: totalFirst,
      second: totalSecond,
    },
    winner,
    margin: Math.round(margin * 10) / 10,
    createdAt: new Date().toISOString(),
  };
};