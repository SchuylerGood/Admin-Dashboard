import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable, Modal, TextInput, Animated } from 'react-native';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useUsers } from './hooks/useUsers';
import { User } from './types/user';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';

interface UserNote {
  userId: string;
  note: string;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const { users, loading, refreshing, loadMore, handleRefresh } = useUsers();
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [isAscending, setIsAscending] = useState(true);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const countries = useMemo(() => {
    const uniqueCountries = ['All Countries', ...new Set(users.map(user => user.country))];
    return uniqueCountries.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(user => user.country === selectedCountry);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [users, selectedCountry, isAscending]);

  const showNotification = () => {
    setShowCopyNotification(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopyNotification(false));
  };

  const handleCopyId = async (id: string) => {
    await Clipboard.setStringAsync(id);
    showNotification();
  };

  const handleAddNote = (userId: string) => {
    setSelectedUserId(userId);
    const existingNote = userNotes.find(note => note.userId === userId);
    setCurrentNote(existingNote?.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (!selectedUserId) return;

    setUserNotes(prev => {
      const existing = prev.filter(note => note.userId !== selectedUserId);
      if (currentNote.trim()) {
        return [...existing, { userId: selectedUserId, note: currentNote.trim() }];
      }
      return existing;
    });

    setShowNoteModal(false);
    setSelectedUserId(null);
    setCurrentNote('');
  };

  useEffect(() => {
    loadMore();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5081F6" />
      </View>
    );
  }

  const renderItem = ({ item } : { item: User }) => {
    const hasNote = userNotes.some(note => note.userId === item.id);
    
    return (
      <View style={styles.userCardWrapper}>
        <LinearGradient
          colors={['#5081F6', '#A463F7']}
          style={styles.gradientBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <AntDesign name="user" size={28} color="#4B90F8" />
          </View>
          <View style={styles.userDetailsContainer}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>@{item.userName}</Text>
              <Pressable
                style={styles.copyButton}
                onPress={() => handleCopyId(item.userName)}
              >
                <Feather name="copy" size={16} color="#666" />
              </Pressable>
            </View>
            <View style={styles.countryDateContainer}>
              <Text style={styles.country}>{item.country}</Text>
              <View style={styles.userDateJoined}>
                <Feather name="calendar" size={16} color="#7D838F" />
                <Text style={styles.userDetailsText}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            {hasNote && (
              <Pressable
                style={styles.viewNoteButton}
                onPress={() => handleAddNote(item.id)}
              >
                <Feather name="file-text" size={16} color="#5081F6" />
              </Pressable>
            )}
            <Pressable
              style={styles.addNoteButton}
              onPress={() => handleAddNote(item.id)}
            >
              <Feather name="edit" size={16} color="#666" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {showCopyNotification && (
        <Animated.View style={[styles.copyNotification, { opacity: fadeAnim }]}>
          <Text style={styles.copyNotificationText}>Copied to clipboard!</Text>
        </Animated.View>
      )}
      <Text style={styles.header}>Users List</Text>
      
      <View style={styles.filtersContainer}>
        <Pressable 
          style={styles.countryFilter}
          onPress={() => setShowCountryModal(true)}
        >
          <Text style={styles.filterText}>{selectedCountry}</Text>
          <Feather name="chevron-down" size={16} color="#666" />
        </Pressable>

        <Pressable 
          style={styles.sortButton}
          onPress={() => setIsAscending(!isAscending)}
        >
          <Text style={styles.filterText}>Date</Text>
          <Feather 
            name={isAscending ? "arrow-up" : "arrow-down"} 
            size={16} 
            color="#666" 
          />
        </Pressable>
      </View>

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

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  countryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  country: {
    fontSize: 12,
    color: '#285CDC',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EFF6FF',
    fontFamily: 'Inter_500Medium',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailsContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  userDateJoined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userDetailsText: {
    fontSize: 14,
    color: '#7D838F',
    fontFamily: 'Inter_400Regular',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
  },
  listContainer: {
    padding: 16,
  },
  userCardWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientBorder: {
    width: 5,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  userCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  countryFilter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    color: '#374151',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    width: '80%',
    maxHeight: '70%',
  },
  modalItem: {
    padding: 16,
    borderRadius: 8,
  },
  modalItemText: {
    fontFamily: 'Inter_500Medium',
    color: '#374151',
    fontSize: 16,
  },
  selectedModalItem: {
    color: '#5081F6',
    fontFamily: 'Inter_600SemiBold',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
    paddingLeft: 12,
  },
  addNoteButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  viewNoteButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  noteModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  noteModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#374151',
  },
  noteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  noteModalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontFamily: 'Inter_500Medium',
  },
  saveButton: {
    backgroundColor: '#5081F6',
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Inter_500Medium',
  },
  copyNotification: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 100,
  },
  copyNotificationText: {
    color: 'white',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
}); 