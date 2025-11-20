import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Router, useRouter } from "expo-router";
import { Banner } from "../../components/Ads";
import { useLeagues } from "../../hooks/useLeagues";
import { Loading } from "../../components/Loading";
import { ErrorMessage } from "../../components/ErrorMessage";
import NoTable from "../../components/tables/NoTable";

export const WatchTables = () => {
  const router: Router = useRouter();
  const { data, error, isPending } = useLeagues();

  if (!data) return <NoTable />;
  if (error) return <ErrorMessage />;
  if (isPending) return <Loading />;
  
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.leaguesContainer}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/tables/[leagueId]", params: { leagueId: item.id } })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
          </Pressable>
        )}
      />  

      {
        process.env.EXPO_PUBLIC_WATCH_TABLE_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_WATCH_TABLE_BANNER_AD_ID} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 55,
  },
  leaguesContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    color: "#6b7280",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
  },
});

export default WatchTables;