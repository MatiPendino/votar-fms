import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Router, useRouter } from "expo-router";
import { AppButton } from "../../components/AppButton";
import { useBattle } from "../../context/BattleContext";
import { League, MC, ModalType } from "../../types";
import SelectionModal from "../../modals/SelectionModal";
import { useLeagues } from "../../hooks/useLeagues";
import { useMcs } from "../../hooks/useMcs";
import { ErrorMessage } from "../../components/ErrorMessage";

export const NewBattleScreen = () => {
  const router: Router = useRouter();
  const { startBattle } = useBattle();
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [firstMc, setFirstMc] = useState<MC | null>(null);
  const [secondMc, setSecondMc] = useState<MC | null>(null);

  const {
    data: leaguesData = [],
    isLoading: isLoadingLeaguesData,
    isError: isErrorLeagues,
  } = useLeagues();

  const {
    data: mcsData = [],
    isLoading: isLoadingMcsData,
    isError: isErrorMcs,
  } = useMcs(selectedLeague?.id ?? null);

  useEffect(() => {
    if (!leaguesData.length) {
      setSelectedLeague(null);
      setFirstMc(null);
      setSecondMc(null);
      return;
    }

    setSelectedLeague((current) => {
      if (!current) return leaguesData[0] ?? null;
      const matched = leaguesData.find((item) => item.id === current.id);
      return matched ?? leaguesData[0] ?? null;
    });
  }, [leaguesData]);

  useEffect(() => {
    if (!selectedLeague || !mcsData.length) {
      setFirstMc(null);
      setSecondMc(null);
      return;
    }

    const first = mcsData[0] ?? null;
    const second = mcsData.length > 1 ? mcsData[1] : null;

    setFirstMc((current) => current ?? first);
    setSecondMc((current) => current ?? second);
  }, [selectedLeague, mcsData]);

  const start = (): void => {
    if (!selectedLeague) {
      Alert.alert("Seleccioná una liga para comenzar");
      return;
    }

    if (!firstMc || !secondMc) {
      Alert.alert("Seleccioná dos MCs para puntuar");
      return;
    }

    if (firstMc.id === secondMc.id) {
      Alert.alert("Los MCs no pueden ser iguales");
      return;
    }

    startBattle({ league: selectedLeague, firstMc, secondMc });
    router.push("/battle/scoring");
  };

  const leagueOptions = useMemo(() => leaguesData.map((league) => league.name), [leaguesData]);
  const mcOptions = useMemo(() => mcsData.map((mc) => mc.aka), [mcsData]);

  const isReady: boolean = !!selectedLeague && !!firstMc && !!secondMc && firstMc.id !== secondMc.id;

  if (isErrorLeagues || isErrorMcs) {
    return (
      <ErrorMessage 
        message="Hubo un error al cargar los datos. Por favor, intentá nuevamente más tarde." 
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Liga</Text>
        <Pressable style={styles.field} onPress={() => setModal("league")}>
          <Text style={styles.fieldText}>
            {
              selectedLeague?.name 
              ?? 
              (isLoadingLeaguesData ? "Cargando ligas..." : "Sin ligas disponibles")
            }
          </Text>
        </Pressable>

        <Text style={styles.label}>Primer MC</Text>
        <Pressable style={styles.field} onPress={() => setModal("first")}>
          <Text style={styles.fieldText}>
            {firstMc?.aka ?? (isLoadingMcsData ? "Cargando MCs..." : "Sin MCs disponibles")}
          </Text>
        </Pressable>

        <Text style={styles.label}>Segundo MC</Text>
        <Pressable style={styles.field} onPress={() => setModal("second")}>
          <Text style={styles.fieldText}>
            {secondMc?.aka ?? (isLoadingMcsData ? "Cargando MCs..." : "Sin MCs disponibles")}
          </Text>
        </Pressable>

        <Text style={styles.helper}>
          Tocá un campo para cambiar la selección. Mantené presionado el botón de puntuación en la siguiente pantalla para reiniciar valores.
        </Text>

        <AppButton label="Comenzar puntuación" onPress={start} disabled={!isReady} />
      </View>

      <SelectionModal
        visible={modal === "league"}
        title="Seleccioná una liga"
        options={leagueOptions}
        onSelect={(label) => {
          const league = leaguesData.find((item) => item.name === label);
          setSelectedLeague(league ?? null);
        }}
        onClose={() => setModal(null)}
      />

      <SelectionModal
        visible={modal === "first"}
        title="Seleccioná el primer MC"
        options={mcOptions}
        onSelect={(value) => {
          const mc = mcsData.find((item) => item.aka === value) ?? null;
          setFirstMc(mc);
          if (mc && secondMc && mc.id === secondMc.id) {
            const alternative = mcsData.find((item) => item.id !== mc.id) ?? null;
            setSecondMc(alternative);
          }
        }}
        onClose={() => setModal(null)}
      />

      <SelectionModal
        visible={modal === "second"}
        title="Seleccioná el segundo MC"
        options={mcOptions}
        onSelect={(value) => {
          const mc = mcsData.find((item) => item.aka === value) ?? null;
          setSecondMc(mc);
          if (mc && firstMc && mc.id === firstMc.id) {
            const alternative = mcsData.find((item) => item.id !== mc.id) ?? null;
            setFirstMc(alternative);
          }
        }}
        onClose={() => setModal(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  field: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  fieldText: {
    fontSize: 16,
    color: "#111827",
  },
  helper: {
    color: "#6b7280",
    marginTop: 12,
    fontSize: 14,
  },
});

export default NewBattleScreen;