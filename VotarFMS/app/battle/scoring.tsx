import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Router, useRouter } from "expo-router";
import { AppButton } from "../../components/AppButton";
import { BonusToggleGroup } from "../../components/BonusToggleGroup";
import { ScoreRow } from "../../components/ScoreRow";
import { Banner } from "../../components/Ads";
import { useBattle } from "../../context/BattleContext";
import { Participant } from "../../types";

const formatValue = (value: number) => Math.round(value * 10) / 10;

export const ScoringScreen = () => {
  const router: Router = useRouter();
  const { 
    battle, config, setScore, toggleExtra, goToNextRound, goToPreviousRound 
  } = useBattle();

  useEffect(() => {
    if (!battle || !config) return;
    
    if (battle.currentRoundIndex >= config.rounds.length) {
      router.replace("/battle/final-summary");
    }
  }, [battle, config, router]);

  const round = useMemo(() => {
    if (!battle || !config) return null;
    return config.rounds[Math.min(battle.currentRoundIndex, config.rounds.length - 1)];
  }, [battle, config]);

  if (!battle || !config || !round) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>No hay una batalla en curso</Text>
          <Text style={styles.subtitle}>Comenzá seleccionando una liga y los MCs.</Text>
          <AppButton 
            label="Crear nueva batalla" 
            onPress={() => router.replace("/battle/new")} 
          />
        </View>
      </ScrollView>
    );
  }

  const score = battle.roundScores[round.id];

  const increment = (participant: Participant, categoryId: string): void => {
    const currentValue = score[participant][categoryId] ?? 0;
    const step = round.step ?? 0.5;
    const category = round.categories.find((item) => item.id === categoryId);
    const categoryStep = category?.step ?? step;
    const categoryMax = category?.max ?? round.max ?? 4;
    const nextValue = Math.min(currentValue + categoryStep, categoryMax);
    setScore(round.id, participant, categoryId, formatValue(nextValue));
  };

  const reset = (participant: Participant, categoryId: string): void => {
    setScore(round.id, participant, categoryId, 0);
  };

  const isFirstRound: boolean = battle.currentRoundIndex === 0;
  const isLastRound: boolean = battle.currentRoundIndex === config.rounds.length - 1;

  const handleNext = (): void => {
    const goSummary = isLastRound;
    goToNextRound();
    if (goSummary) {
      router.push("/battle/final-summary");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{round.label}</Text>
        <Text style={styles.subtitle}>{config.name}</Text>
        <View style={styles.namesRow}>
          <Text style={styles.name}>{battle.firstMc}</Text>
          <Text style={styles.name}>{battle.secondMc}</Text>
        </View>

        {round.categories.map((category) => (
          <ScoreRow
            key={category.id}
            category={category}
            firstLabel={battle.firstMc}
            secondLabel={battle.secondMc}
            firstValue={score.first[category.id] ?? 0}
            secondValue={score.second[category.id] ?? 0}
            onIncrementFirst={() => increment("first", category.id)}
            onResetFirst={() => reset("first", category.id)}
            onIncrementSecond={() => increment("second", category.id)}
            onResetSecond={() => reset("second", category.id)}
          />
        ))}

        {score.extras?.first && round.extras?.first && (
          <BonusToggleGroup
            label={`Respuesta ${battle.firstMc}`}
            values={score.extras.first}
            onToggle={(index) => toggleExtra(round.id, "first", index)}
          />
        )}

        {score.extras?.second && round.extras?.second && (
          <BonusToggleGroup
            label={`Respuesta ${battle.secondMc}`}
            values={score.extras.second}
            onToggle={(index) => toggleExtra(round.id, "second", index)}
          />
        )}

        <View style={styles.actions}>
          {!isFirstRound && (
            <AppButton label="Anterior" variant="secondary" onPress={goToPreviousRound} />
          )}
          <AppButton label={isLastRound ? "Finalizar" : "Siguiente ronda"} onPress={handleNext} />
        </View>
      </View>

      {
        process.env.EXPO_PUBLIC_BATTLE_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_BATTLE_BANNER_AD_ID} />
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
    marginHorizontal: 24,
    marginTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  namesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  actions: {
    marginTop: 24,
  },
});

export default ScoringScreen;