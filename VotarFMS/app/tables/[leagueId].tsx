import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import MCRow from "../../components/tables/MCRow";
import { Banner } from "../../components/Ads";
import NoTable from "../../components/tables/NoTable";
import { Loading } from "../../components/Loading";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useStandings } from "../../hooks/useStandings";
import { showInterstitial } from "../../utils/showInterstitial";

export const TableDetail = () => {
  const { leagueId } = useLocalSearchParams();
  const { data, error, isPending } = useStandings(Number(leagueId));

  useEffect(() => {
    try {
      showInterstitial(process.env.EXPO_PUBLIC_INTERS_TABLES_AD_ID ?? "");
    } catch (error) {
      console.warn("Error showing interstitial:", error);
    }
  }, []);

  if (!data) return <NoTable />;
  if (error) return <ErrorMessage />;
  if (isPending) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { width: 40 }]}>Pos</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>MC</Text>
          <Text style={[styles.headerText, { width: 60, textAlign: "right" }]}>Pts</Text>
          <Text style={[styles.headerText, { width: 80, textAlign: "right" }]}>Puntaje</Text>
        </View>
        <FlatList 
          data={data} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ index, item }) => <MCRow index={index} standing={item} />} 
        />
      </View>

      {
        process.env.EXPO_PUBLIC_TABLE_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_TABLE_BANNER_AD_ID} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#d1d5db",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
  },
});

export default TableDetail;