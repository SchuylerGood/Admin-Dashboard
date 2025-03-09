import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useUsers } from './hooks/useUsers';
import { User } from './types/user';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import { LinearGradient } from 'expo-linear-gradient';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const { users, loading, refreshing, loadMore, handleRefresh } = useUsers();

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

  const renderItem = ({ item } : { item: User }) => (
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
          <Text style={styles.userName}>@{item.userName}</Text>
          <View style={styles.countryDateContainer}>
            <Text style={styles.country}>{item.country}</Text>
            <View style={styles.userDateJoined}>
              <Feather name="calendar" size={16} color="#7D838F" />
              <Text style={styles.userDetailsText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    
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
      <Text style={styles.header}>Users List</Text>
      <FlatList
        data={users}
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
}); 