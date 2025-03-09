import { styles } from './styles/styles';
import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, ActivityIndicator, Pressable, Modal, TextInput, Animated } from 'react-native';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useUsers } from './hooks/useUsers';
import { User, UserNote } from './types/user';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold});
  const { users, loading, refreshing, loadMore, handleRefresh } = useUsers();
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [searchQuery, setSearchQuery] = useState('');
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
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply country filter
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
  }, [users, selectedCountry, isAscending, searchQuery]);

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
  }, [loadMore]);

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
      <Text style={styles.header}>Users</Text>
      
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search username..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#666" />
            </Pressable>
          )}
        </View>
        
        <View style={styles.filterButtonsContainer}>
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
