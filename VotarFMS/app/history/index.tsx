import { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, Text, View
} from "react-native";
import { Router, useRouter } from "expo-router";
import { AppButton } from "../../components/AppButton";
import { SummaryList } from "../../components/SummaryList";
import { Banner } from "../../components/Ads";
import { useHistory } from "../../context/HistoryContext";
import { BattleRecord } from "../../types";
import { showInterstitial } from "../../utils/showInterstitial";

export const BattleHistoryScreen = () => {
  const router: Router = useRouter();
  const { battles, isLoading, removeBattle } = useHistory();
  const [selected, setSelected] = useState<BattleRecord | null>(null);

  useEffect(() => {
    try {
      showInterstitial(process.env.EXPO_PUBLIC_INTERS_WATCH_TABLES_AD_ID ?? "");
    } catch (error) {
      console.warn("Error showing interstitial:", error);
    }
  }, []);

  const confirmDelete = (record: BattleRecord) => {
    Alert.alert("Eliminar batalla", "¿Querés eliminar esta puntuación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => removeBattle(record.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: BattleRecord }) => (
    <Pressable
      style={styles.card}
      onPress={() => setSelected(item)}
      onLongPress={() => confirmDelete(item)}
    >
      <Text style={styles.title}>{`${item.firstMc} vs ${item.secondMc}`}</Text>
      <Text style={styles.subtitle}>
        {`${item.leagueName} · ${new Date(item.createdAt).toLocaleDateString()}`}
      </Text>
      <Text style={styles.totals}>
        {`${item.totals.first.toFixed(1)} - ${item.totals.second.toFixed(1)} (${item.winner})`}
      </Text>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator size="large" color="#1f2937" />
      </View>
    );
  }

  if (!battles.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.subtitle}>Todavía no guardaste puntuaciones.</Text>
        <AppButton label="Crear nueva" onPress={() => router.replace("/battle/new")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        contentContainerStyle={styles.historyContainer}
        data={battles} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
      />

      <Modal visible={!!selected} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>
                  {`${selected.firstMc} vs ${selected.secondMc}`}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {`${selected.leagueName} · ${new Date(selected.createdAt, ).toLocaleString()}`}
                </Text>
                <SummaryList
                  rows={selected.summary}
                  firstLabel={selected.firstMc}
                  secondLabel={selected.secondMc}
                />
                <Text style={styles.totals}>
                  {`${selected.firstMc}: ${selected.totals.first.toFixed(1)}`}
                </Text>
                <Text style={styles.totals}>
                  {`${selected.secondMc}: ${selected.totals.second.toFixed(1)}`}
                </Text>
                <AppButton label="Cerrar" variant="secondary" onPress={() => setSelected(null)} />
                <AppButton
                  label="Eliminar"
                  onPress={() => {
                    setSelected(null);
                    confirmDelete(selected);
                  }}
                />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {
        process.env.EXPO_PUBLIC_HISTORY_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_HISTORY_BANNER_AD_ID} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70,
  },
  historyContainer: {
    padding: 24,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#4b5563",
  },
  totals: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalSubtitle: {
    marginTop: 4,
    color: "#4b5563",
  },
});

export default BattleHistoryScreen;