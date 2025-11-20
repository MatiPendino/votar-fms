import { useQuery } from "@tanstack/react-query";
import { fetchStandingsByLeague } from "../api/standings";

export const useStandings = (leagueId: number) => {
    return useQuery({
        queryKey: ["standings", leagueId],
        queryFn: () => fetchStandingsByLeague(leagueId)
    });
};