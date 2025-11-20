import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    text: {
        marginTop: 12,
        fontSize: 16,
        color: "#4b5563",
        fontWeight: "500",
    },
});
