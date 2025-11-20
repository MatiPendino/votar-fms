import { FlatList, Modal, Pressable, Text, StyleSheet } from "react-native";
import { AppButton } from "../components/AppButton";

interface ModalProps {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const SelectionModal = ({ visible, title, options, onSelect, onClose }: ModalProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={(item: string, index: number) => `${item}-${index}`}
                        renderItem={({ item }: {item: string}) => (
                            <Pressable
                                style={styles.option}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.optionText}>
                                    {item}
                                </Text>
                            </Pressable>
                        )}
                    />
                    <AppButton label="Cerrar" variant="secondary" onPress={onClose} />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(17, 24, 39, 0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        maxHeight: "70%",
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
        color: "#111827",
    },
    option: {
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: "#e5e7eb",
    },
    optionText: {
        fontSize: 16,
        color: "#1f2937",
    },
});

export default SelectionModal;