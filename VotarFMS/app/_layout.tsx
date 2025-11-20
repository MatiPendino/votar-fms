import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import mobileAds from 'react-native-google-mobile-ads';
import { BattleProvider } from "../context/BattleContext";
import { HistoryProvider } from "../context/HistoryContext";
import { MAIN_COLOR } from "../constants";

Sentry.init({
  dsn: `https://${process.env.EXPO_PUBLIC_SENTRY_URL}.ingest.us.sentry.io/${process.env.EXPO_PUBLIC_SENTRY_KEY}`,
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient: QueryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  useEffect(() => {
    try {
      mobileAds().initialize();
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HistoryProvider>
        <BattleProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: MAIN_COLOR },
              headerTintColor: "white",
              headerTitleStyle: { fontWeight: "700" },
              contentStyle: { backgroundColor: "#f3f4f6" },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Votar FMS" }} />
            <Stack.Screen name="battle/new" options={{ title: "Nueva puntuación" }} />
            <Stack.Screen name="battle/scoring" options={{ title: "Puntuación" }} />
            <Stack.Screen name="battle/final-summary" options={{ title: "Resultado final" }} />
            <Stack.Screen name="history/index" options={{ title: "Historial" }} />
            <Stack.Screen name="tables/index" options={{ title: "Tablas FMS" }} />
            <Stack.Screen name="tables/[leagueId]" options={{ title: "Tabla" }} />
          </Stack>
        </BattleProvider>
      </HistoryProvider>  
    </QueryClientProvider>
  );
});