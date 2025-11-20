import { StyleSheet, Text, View } from "react-native";
import { SummaryRow } from "../types";

interface SummaryListProps {
  rows: SummaryRow[];
  firstLabel: string;
  secondLabel: string;
}

export const SummaryList = ({ rows, firstLabel, secondLabel }: SummaryListProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { flex: 1 }]}></Text>
        <Text style={[styles.headerText, { width: 80, textAlign: "right" }]}>
          {firstLabel}
        </Text>
        <Text style={[styles.headerText, { width: 80, textAlign: "right" }]}>
          {secondLabel}
        </Text>
      </View>
      
      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.value}>{row.first.toFixed(1)}</Text>
          <Text style={styles.value}>{row.second.toFixed(1)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  value: {
    width: 80,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
});
