import { View, Pressable, Text, Modal, FlatList } from "react-native";
import { styles } from "../styles/styles";
import { CountryModalProps } from "../types/types";

export const CountryModal = ( { showCountryModal, setShowCountryModal, selectedCountry, setSelectedCountry, countries }: CountryModalProps ) => {
  return (
    <Modal
        visible={showCountryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowCountryModal(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={countries}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    item === selectedCountry && styles.selectedModalItem
                  ]}>{item}</Text>
                </Pressable>
              )}
              keyExtractor={item => item}
            />
          </View>
        </Pressable>
      </Modal>
  );
};
