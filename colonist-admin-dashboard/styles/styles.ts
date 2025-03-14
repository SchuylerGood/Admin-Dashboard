import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    filtersContainer: {
      gap: 12,
      marginBottom: 16,
      marginHorizontal: 16,
      width: 'auto',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#333',
      fontFamily: 'Inter_400Regular',
      padding: 0,
    },
    filterButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
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