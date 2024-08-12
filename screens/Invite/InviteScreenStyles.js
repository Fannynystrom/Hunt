import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    //rubrik
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 16,
    },
  
    //sökrutan för användare
    searchInput: {
      height: 45,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 16,
    },
    alphabetContainer: {
      flex: 1,
    },
    letterGroup: {
      marginBottom: 16,
    },
  
    //bokstäverna för alla användare, A,B,C osv
    sectionHeaderText: {
      fontSize: 19,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#007BFF', 
  
    },
  
    //conteiner för varje användare
    userItem: {
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: 10,
      marginBottom: 10,
      width: 110,
      height: 120,
      position: 'relative', 
      backgroundColor: '#D3D3D3',
      borderRadius: 20,
  
    },
  
    selectedUserItem: {
      backgroundColor: '#e0f7fa',
      borderRadius: 20,
    },
  
    //bilden (avatar)
    userAvatar: {
      width: 60,
      height: 65,
      borderRadius: 25,
      backgroundColor: '#ccc',
      marginBottom: 5,
      marginTop: 10,
    },
    username: {
      fontSize: 19,
      marginTop: 1,
    },
  
    //conteiner för check markering för vald användare
    checkmarkContainer: {
      position: 'absolute', 
      top: 1,
      left: 20,
      width: '60%',
      height: '65%',
      backgroundColor: '#007BFF',
      borderRadius: 25, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    //själva checkmarkeringen 
    checkmark: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  
  
    inviteButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 15,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    inviteButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });






export default styles;
