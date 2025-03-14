import { View, Pressable, Text, Modal, TextInput } from "react-native";
import { styles } from "../styles/styles";
import { NoteModalProps } from "../types/types";

export const NoteModal = ( { showNoteModal, setShowNoteModal, currentNote, setCurrentNote, handleSaveNote }: NoteModalProps ) => {
    return(
    <Modal
        visible={showNoteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoteModal(false)}
    >
        <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowNoteModal(false)}
        >
            <Pressable style={styles.noteModalContent}>
            <Text style={styles.noteModalTitle}>Add Note</Text>
            <TextInput
                style={styles.noteInput}
                multiline
                numberOfLines={4}
                value={currentNote}
                onChangeText={setCurrentNote}
                placeholder="Type your note here..."
                placeholderTextColor="#666"
            />
            <View style={styles.noteModalButtons}>
                <Pressable
                style={[styles.noteModalButton, styles.cancelButton]}
                onPress={() => setShowNoteModal(false)}
                >
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                style={[styles.noteModalButton, styles.saveButton]}
                onPress={handleSaveNote}
                >
                <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
            </View>
            </Pressable>
        </Pressable>
    </Modal>
    )
}
