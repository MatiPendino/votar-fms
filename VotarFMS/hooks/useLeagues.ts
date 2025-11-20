import { useQuery } from "@tanstack/react-query";
import { fetchLeagues } from "../api/leagues";

export const useLeagues = () => {
    return useQuery({
        queryKey: ["leagues"],
        queryFn: fetchLeagues
    });
};