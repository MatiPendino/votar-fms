import { MAX_POINTS, STEP_POINTS } from "../constants";
import { LeagueConfig, Category, RoundDefinition, SummarySection, RoundId } from "../types";

const performanceCategories = (): Category[] => {
  return [
    { id: "scene", label: "Escena" },
    { id: "flow", label: "Flow" },
    { id: "skills", label: "Skills" },
  ];
};

const createPatternCategories = (
  count: number, labelPrefix: string
): Category[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `${labelPrefix.toLowerCase()}${index + 1}`,
    label: `${labelPrefix} ${index + 1}`,
  }));
}

const makeRound = (
  id: RoundId, label: string, patternCount: number, patternLabel = "Patrón"
): RoundDefinition => {
  return ({
    id,
    label,
    categories: [
      ...createPatternCategories(patternCount, patternLabel),
      ...performanceCategories(),
    ],
    step: STEP_POINTS,
    max: MAX_POINTS
  });
};

const easyRound: RoundDefinition = makeRound("easy", "Easy Mode", 6);
const hardRound: RoundDefinition = makeRound("hard", "Hard Mode", 6);
const themesRoundA: RoundDefinition = makeRound("themes1", "Temáticas A", 4, "Tema");
const themesRoundB: RoundDefinition = makeRound("themes2", "Temáticas B", 4, "Tema");
const randomRound: RoundDefinition = makeRound("random", "Random Mode", 8);

const deluxeRound: RoundDefinition = {
  ...makeRound("deluxe", "Deluxe", 8),
  categories: [
    ...createPatternCategories(8, "Patrón"),
    ...performanceCategories(),
  ],
};

const bloodRoundA: RoundDefinition = {
  ...makeRound("blood1", "Sangre 1", 6),
  extras: {
    first: { count: 6, label: "Plus", points: 1 },
  },
};

const bloodRoundB: RoundDefinition = {
  ...makeRound("blood2", "Sangre 2", 6),
  extras: {
    second: { count: 6, label: "Plus", points: 1 },
  },
};

const standardRounds: RoundDefinition[] = [
  easyRound, hardRound, themesRoundA, themesRoundB, randomRound, 
  bloodRoundA, bloodRoundB, deluxeRound
];

const standardSummary: SummarySection[] = [
  { id: "easy", label: "Easy Mode", rounds: ["easy"] },
  { id: "hard", label: "Hard Mode", rounds: ["hard"] },
  { id: "themes", label: "Temáticas", rounds: ["themes1", "themes2"] },
  { id: "random", label: "Random Mode", rounds: ["random"] },
  { id: "blood", label: "Sangre", rounds: ["blood1", "blood2"] },
  { id: "deluxe", label: "Deluxe", rounds: ["deluxe"] },
];

export const buildLeagueConfig = (leagueId: string, leagueName: string): LeagueConfig => {
  return ({
    id: leagueId,
    name: leagueName,
    rounds: standardRounds, 
    summary: standardSummary, 
    winnerThreshold: 5, 
    allowSave: true  
  });
};