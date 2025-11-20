import { 
  Pressable, PressableStateCallbackType, StyleSheet, Text, View 
} from "react-native";
import { MAIN_COLOR } from "../constants";

interface BonusToggleGroupProps {
  label: string;
  values: boolean[];
  onToggle: (index: number) => void;
}

export const BonusToggleGroup = ({ label, values, onToggle }: BonusToggleGroupProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.row}>
        {values.map((active, index) => {
          const style = ({ pressed }: PressableStateCallbackType) => [
            styles.chip,
            !active ? styles.chipInactive : null,
            pressed ? { opacity: 0.8 } : null,
          ];

          return (
            <Pressable
              key={`${label}-${index}`}
              onPress={() => onToggle(index)}
              style={style}
            >
              <Text style={[styles.chipText, !active ? styles.chipTextInactive : null]}>
                {active ? "+1" : "0"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chip: {
    minWidth: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: MAIN_COLOR,
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  chipInactive: {
    backgroundColor: "#d1d5db",
  },
  chipText: {
    color: "white",
    fontWeight: "600",
  },
  chipTextInactive: {
    color: "#1f2937",
  },
});