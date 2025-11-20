import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Router, useRouter } from "expo-router";
import { AppButton } from "../components/AppButton";
import { Banner } from "../components/Ads";
import { RATE_URL, REMOVE_ADS_URL } from "../constants";

const openLink = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("No se pudo abrir el enlace");
    }
  } catch {
    Alert.alert("No se pudo abrir el enlace");
  }
};

export const Home = () => {
  const router: Router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Votar FMS</Text>
          <Text style={styles.subtitle}>
            Puntuá batallas de FMS con los formatos clásicos, guarda tus resultados y consulta las tablas de cada temporada
          </Text>
        </View>

        <View style={styles.card}>
          <AppButton 
            label="Puntuar nueva batalla" 
            onPress={() => router.push("/battle/new")} 
          />
          <AppButton 
            label="Historial de batallas" variant="secondary" 
            onPress={() => router.push("/history")} 
          />
          <AppButton 
            label="Ver tablas" variant="secondary" 
            onPress={() => router.push("/tables")} 
          />
          <AppButton label="Calificanos en Google Play" onPress={() => openLink(RATE_URL)} />
          <AppButton label="Versión sin anuncios" onPress={() => openLink(REMOVE_ADS_URL)} />
        </View>  
      </View>
      
      {
        process.env.EXPO_PUBLIC_HOME_BANNER_AD_ID && 
        <Banner bannerId={process.env.EXPO_PUBLIC_HOME_BANNER_AD_ID} />
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  contentContainer: {
    padding: 24
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

export default Home;