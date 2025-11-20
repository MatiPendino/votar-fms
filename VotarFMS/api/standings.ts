import * as Sentry from '@sentry/react-native';
import { supabase } from "../lib/supabaseClient";
import { Standing } from "../types";

export const fetchStandingsByLeague = async (leagueId: number) => {
    const { data, error } = await supabase
        .from("standing")
        .select("id, points, punctuation, league_id, mc (id, aka, league_id)")
        .eq("league_id", leagueId)
        .order("points", { ascending: false })
        .order("punctuation", { ascending: false });

    if (error) {
        Sentry.captureException(error);
        throw error;
    }

    return data ?? [] as Standing[];
};