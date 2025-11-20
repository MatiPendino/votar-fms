import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Router, useRouter } from "expo-router";

interface ErrorMessageProps {
    message?: string;
}

export const ErrorMessage = ({message = "Hubo un error"}: ErrorMessageProps) => {
  const router: Router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1f2937" />
      </Pressable>

      <Text style={styles.title}>Oops...</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        color: "#4b5563",
        maxWidth: 260,
    },
});
