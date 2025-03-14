import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { User, UserNote } from '../types/types';
import { styles } from '../styles/styles';
                
interface UserItemProps {
  item: User;
  userNotes: UserNote[];
  onCopyUsername: (username: string) => void;
  onAddNote: (userId: string) => void;
}

export const UserItem = ({ item, userNotes, onCopyUsername, onAddNote }: UserItemProps) => {
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
              onPress={() => onCopyUsername(item.userName)}
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
              onPress={() => onAddNote(item.id)}
            >
              <Feather name="file-text" size={16} color="#5081F6" />
            </Pressable>
          )}
          <Pressable
            style={styles.addNoteButton}
            onPress={() => onAddNote(item.id)}
          >
            <Feather name="edit" size={16} color="#666" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};