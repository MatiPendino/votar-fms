import { BattleState, Participant, RoundId, RoundScore } from "../types";

export const updateScore = (
    prev: BattleState, roundId: RoundId, participant: Participant, 
    categoryId: string, value: number
): BattleState => {
    const roundScore: RoundScore = prev.roundScores[roundId];
    if (!roundScore) return prev;
    
    const updatedParticipantScores = {
        ...roundScore[participant],
        [categoryId]: value,
    };

    return {
        ...prev,
        roundScores: {
            ...prev.roundScores,
            [roundId]: {
                ...roundScore,
                [participant]: updatedParticipantScores,
            },
        }
    };
}

export const addExtras = (
    prev: BattleState, roundId: RoundId, participant: Participant, index: number
): BattleState => {      
    const roundScore: RoundScore = prev.roundScores[roundId];
    if (!roundScore?.extras) return prev;
    
    const currentExtras = roundScore.extras[participant];
    if (!currentExtras) return prev;

    const updatedExtras: boolean[] = currentExtras.map(
        (value, idx) => idx === index ? !value : value
    );

    return {
        ...prev,
        roundScores: {
            ...prev.roundScores,
            [roundId]: {
                ...roundScore,
                extras: {
                    ...roundScore.extras,
                    [participant]: updatedExtras,
                },
            },
        }
    };
}