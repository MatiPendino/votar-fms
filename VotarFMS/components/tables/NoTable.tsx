import { Text, View, StyleSheet } from "react-native";

const NoTable = () => {
    return (
        <View style={styles.fallback}>
            <Text style={styles.headerText}>Tabla no disponible.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#4b5563",
    },
    fallback: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
});

export default NoTable;