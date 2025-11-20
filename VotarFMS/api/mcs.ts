import * as Sentry from '@sentry/react-native';
import { supabase } from "../lib/supabaseClient";
import { MC } from "../types";

export const fetchMcsByLeague = async (leagueId: number) => {
    const { data, error } = await supabase
        .from("mc")
        .select("id, aka, league_id")
        .eq("league_id", leagueId)
        .order("aka", { ascending: true });

    if (error) {
        Sentry.captureException(error);
        throw error;
    }

    return data ?? [] as MC[];
};