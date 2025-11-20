import { Pressable, Text, StyleSheet } from "react-native";
import { BattleRecord } from "../../types";

interface Props {
    battle: BattleRecord;
    setSelected: (battle: BattleRecord) => void;
    confirmDelete: (battle: BattleRecord) => void;
}

const BattleHistoryCard = ({ battle, setSelected, confirmDelete }: Props) => (
    <Pressable
        style={styles.card}
        onPress={() => setSelected(battle)}
        onLongPress={() => confirmDelete(battle)}
    >
        <Text style={styles.title}>{`${battle.firstMc} vs ${battle.secondMc}`}</Text>
        <Text style={styles.subtitle}>
            {`${battle.leagueName} · ${new Date(battle.createdAt).toLocaleDateString()}`}
        </Text>
        <Text style={styles.totals}>
            {`
                ${battle.totals.first.toFixed(1)} - ${battle.totals.second.toFixed(1)} 
                (${battle.winner})
            `}
        </Text>
    </Pressable>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        shadowColor: "black",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#4b5563",
    },
    totals: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
    },
});

export default BattleHistoryCard;