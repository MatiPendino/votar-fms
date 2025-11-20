import * as Sentry from '@sentry/react-native';
import { supabase } from "../lib/supabaseClient";
import { League } from '../types';

export const fetchLeagues = async () => {
    const { data, error } = await supabase
        .from("league")
        .select("id, name, slug")
        .order("name", { ascending: true });

    if (error) {
        Sentry.captureException(error);
        throw error;
    }

    return data ?? [] as League[];
};
