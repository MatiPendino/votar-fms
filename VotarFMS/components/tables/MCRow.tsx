import { View, Text, StyleSheet } from "react-native";
import { Standing } from "../../types";

interface Props {
    index: number;
    standing: Standing;
}

const MCRow = ({index, standing}: Props) => {
    return (
        <View style={styles.row}>
            <Text style={styles.position}>{index+1}</Text>
            <Text style={styles.name}>{standing.mc ? standing.mc.aka : "No MC"}</Text>
            <Text style={styles.points}>{standing.points}</Text>
            <Text style={styles.punctuation}>{standing.punctuation.toFixed(1)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "#e5e7eb",
    },
    position: {
        width: 40,
        fontWeight: "700",
        color: "#1f2937",
    },
    name: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    points: {
        width: 60,
        textAlign: "right",
        fontWeight: "600",
        color: "#111827",
    },
    punctuation: {
        width: 80,
        textAlign: "right",
        color: "#4b5563",
    },
})

export default MCRow;