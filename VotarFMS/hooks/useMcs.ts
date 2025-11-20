import { useQuery } from "@tanstack/react-query";
import { fetchMcsByLeague } from "../api/mcs";

export const useMcs = (leagueId: number | null) => {
    return useQuery({
        queryKey: ["mcs", leagueId],
        queryFn: () => fetchMcsByLeague(leagueId as number),
        enabled: !!leagueId
    });
};