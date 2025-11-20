import { useEffect, useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Sentry from '@sentry/react-native';
import { Router, useRouter } from "expo-router";
import { AppButton } from "../../components/AppButton";
import { SummaryList } from "../../components/SummaryList";
import { Banner, interstitial } from "../../components/Ads";
import { useBattle } from "../../context/BattleContext";
import { useHistory } from "../../context/HistoryContext";
import { calculateBattleResult } from "../../utils/calculateBattleResult";

export const FinalSummaryScreen = () => {
  const router: Router = useRouter();
  const { battle, config, resetBattle } = useBattle();
  const { addBattle } = useHistory();

  const result = useMemo(() => {
    if (!battle) return null;
    return calculateBattleResult(battle);
  }, [battle]);

  useEffect(() => {
    interstitial(process.env.EXPO_PUBLIC_INTERS_VOTE_AD_ID ?? "");
  }, []);

  if (!battle || !config || !result) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>No hay resultados para mostrar</Text>
          <AppButton label="Volver al inicio" onPress={() => router.replace("/")} />
        </View>
      </ScrollView>
    );
  }

  const handleFinish = async (save: boolean) => {
    try {
      if (save && config.allowSave) {
        await addBattle({
          id: Date.now().toString(),
          ...result,
        });
        Alert.alert("Puntuación guardada");
      }
    } catch (error) {
      Alert.alert("No se pudo guardar la puntuación");
      Sentry.captureException(error);
    } finally {
      resetBattle();
      router.replace("/");
    }
  };

  const handleNewBattle = (): void => {
    resetBattle();
    router.replace("/battle/new");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Resultado final</Text>
          <Text style={styles.subtitle}>
            {`${battle.firstMc} vs ${battle.secondMc} · ${config.name}`}
          </Text>
          <Text style={styles.winner}>
            {result.winner === "Réplica" ? "Réplica" : `Ganador: ${result.winner}`}
          </Text>
        </View>

        <SummaryList 
          rows={result.summary} 
          firstLabel={battle.firstMc} 
          secondLabel={battle.secondMc} 
        />

        <View style={styles.totalsRow}>
          <Text style={styles.total}>
            {`${battle.firstMc}: ${result.totals.first.toFixed(1)}`}
          </Text>
          <Text style={styles.total}>
            {`${battle.secondMc}: ${result.totals.second.toFixed(1)}`}
          </Text>
        </View>

        <View style={styles.actions}>
          {
            config.allowSave 
            ? 
            <>
              <AppButton label="Guardar puntuación" onPress={() => handleFinish(true)} />
              <AppButton 
                label="Finalizar sin guardar" variant="secondary" 
                onPress={() => handleFinish(false)} 
              />
              <AppButton 
                label="Nueva puntuación" 
                variant="primary" 
                onPress={handleNewBattle} 
              />
            </>
            : 
            <>
              <AppButton label="Finalizar" onPress={() => handleFinish(false)} />
              <AppButton 
                label="Nueva puntuación" 
                variant="primary" 
                onPress={handleNewBattle} 
              />
            </>
          }
        </View>
      </View>

      {
        process.env.EXPO_PUBLIC_FINAL_RESULT_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_FINAL_RESULT_BANNER_AD_ID} />
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 24,
    margin: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 4,
  },
  winner: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  actions: {
    marginTop: 24,
  },
});

export default FinalSummaryScreen;