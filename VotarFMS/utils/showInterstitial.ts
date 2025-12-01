import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
    INTERSTITIALS_THIS_SESSION_KEY, LAST_INTERSTITIAL_AT_KEY, LAST_INTERSTITIAL_DATE_KEY, 
    MAX_INTERSTITIALS_PER_SESSION, MIN_INTERSTITIAL_INTERVAL_MS 
} from "../constants";
import { interstitial } from "../components/Ads";

const getToday = (): string => new Date().toISOString().split("T")[0];

export const showInterstitial = async (adUnitId: string) => {
    const now: number = Date.now();
    const today: string = getToday();

    // Load previous data
    const [lastShownRaw, countRaw, sessionDate] = await Promise.all([
        AsyncStorage.getItem(LAST_INTERSTITIAL_AT_KEY),
        AsyncStorage.getItem(INTERSTITIALS_THIS_SESSION_KEY),
        AsyncStorage.getItem(LAST_INTERSTITIAL_DATE_KEY),
    ]);

    let lastShown: number | null = lastShownRaw ? Number(lastShownRaw) : null;
    let count: number = countRaw ? Number(countRaw) : 0;

    // Daily reset
    if (sessionDate !== today) {
        count = 0;
        lastShown = null;

        await AsyncStorage.multiSet([
            [INTERSTITIALS_THIS_SESSION_KEY, "0"],
            [LAST_INTERSTITIAL_AT_KEY, ""],
            [LAST_INTERSTITIAL_DATE_KEY, today],
        ]);
    }

    // Max per session
    if (count >= MAX_INTERSTITIALS_PER_SESSION) {
        return;
    }

    // Minimum interval between interstitials
    if (lastShown && now - lastShown < MIN_INTERSTITIAL_INTERVAL_MS) {
        return;
    }

    // Show ad
    await interstitial(adUnitId);

    // Save updated counters
    await AsyncStorage.multiSet([
        [LAST_INTERSTITIAL_AT_KEY, String(now)],
        [INTERSTITIALS_THIS_SESSION_KEY, String(count + 1)],
        [LAST_INTERSTITIAL_DATE_KEY, today],
    ]);
}