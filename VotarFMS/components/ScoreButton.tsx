import { Pressable, PressableStateCallbackType, StyleSheet, Text } from "react-native";

interface ScoreButtonProps {
  value: number;
  onIncrement: () => void;
  onReset: () => void;
}

export const ScoreButton = ({ value, onIncrement, onReset }: ScoreButtonProps) => {
  const style = ({ pressed }: PressableStateCallbackType) => [
    styles.container, pressed ? styles.pressed : null
  ];

  return (
    <Pressable onPress={onIncrement} onLongPress={onReset} style={style}>
      <Text style={styles.value}>{value.toFixed(1)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});