import { 
  Pressable, PressableStateCallbackType, StyleSheet, Text, ViewStyle 
} from "react-native";
import { MAIN_COLOR, SECONDARY_COLOR } from "../constants";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const getVariantStyle = (variant: "primary" | "secondary"): ViewStyle => {
  return variant === "secondary" ? styles.secondary : styles.primary;
};

export const AppButton = ({ 
  label, onPress, disabled=false, variant="primary" 
}: AppButtonProps) => {
  const style = ({ pressed }: PressableStateCallbackType) => [
    styles.base,
    getVariantStyle(variant),
    pressed && !disabled ? { opacity: 0.8 } : null,
    disabled ? styles.disabled : null,
  ];

  return (
    <Pressable onPress={onPress} style={style} disabled={disabled}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  primary: {
    backgroundColor: MAIN_COLOR,
  },
  secondary: {
    backgroundColor: SECONDARY_COLOR,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});