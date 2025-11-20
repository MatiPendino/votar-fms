import { StyleSheet, Text, View } from "react-native";
import { ScoreCategory } from "../types";
import { ScoreButton } from "./ScoreButton";

interface ScoreRowProps {
  category: ScoreCategory;
  firstLabel: string;
  secondLabel: string;
  firstValue: number;
  secondValue: number;
  onIncrementFirst: () => void;
  onResetFirst: () => void;
  onIncrementSecond: () => void;
  onResetSecond: () => void;
}

export const ScoreRow = ({
  category, firstLabel, secondLabel, firstValue, secondValue, onIncrementFirst,
  onResetFirst, onIncrementSecond, onResetSecond,
}: ScoreRowProps) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{category.label}</Text>
        <Text style={styles.subtitle}>{`${firstLabel} / ${secondLabel}`}</Text>
      </View>
      <View style={styles.buttons}>
        <ScoreButton
          value={firstValue}
          onIncrement={onIncrementFirst}
          onReset={onResetFirst}
        />
        <ScoreButton
          value={secondValue}
          onIncrement={onIncrementSecond}
          onReset={onResetSecond}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
});