import { styles } from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, ActivityIndicator, Pressable, Modal, TextInput, Animated } from 'react-native';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, UserNote } from '../types/types';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// Components
import { UserItem } from './UserItem';
import { CountryModal } from './CountryModal';
import { NoteModal } from './NoteModal';

export const Dashboard = () => {
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

  const renderItem = ({ item }: { item: User }) => (
    <UserItem
      item={item}
      userNotes={userNotes}
      onCopyUsername={handleCopyId}
      onAddNote={handleAddNote}
    />
  );
  
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

      <CountryModal
        showCountryModal={showCountryModal}
        setShowCountryModal={setShowCountryModal}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
      />

      <NoteModal
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        handleSaveNote={handleSaveNote}
      />

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