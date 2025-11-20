import React, { 
  createContext, useCallback, useContext, useEffect, useMemo, useState 
} from "react";
import * as Sentry from '@sentry/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BattleRecord } from "../types";

const STORAGE_KEY = "@votarfms:battles";

interface HistoryContextValue {
  battles: BattleRecord[];
  isLoading: boolean;
  addBattle: (record: BattleRecord) => Promise<void>;
  removeBattle: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

export const HistoryProvider = ({ children }: {children: React.ReactNode}) => {
  const [battles, setBattles] = useState<BattleRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: BattleRecord[] = JSON.parse(stored);
        setBattles(parsed);
      } else {
        setBattles([]);
      }
    } catch (error) {
      setBattles([]);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBattle = useCallback(async (record: BattleRecord) => {
    let nextList: BattleRecord[] = [];
    setBattles((prev) => {
      nextList = [record, ...prev];
      return nextList;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  const removeBattle = useCallback(async (id: string) => {
    let nextList: BattleRecord[] = [];
    setBattles((prev) => {
      nextList = prev.filter((battle) => battle.id !== id);
      return nextList;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  const value = useMemo<HistoryContextValue>(() => ({ 
    battles, isLoading, addBattle, removeBattle, refresh 
  }),
    [battles, isLoading, addBattle, removeBattle, refresh]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = (): HistoryContextValue => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};