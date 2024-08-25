import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1,
  },
  logoutButtonText: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: 'black',
  },
  placeholderImage: {
    width: 250,
    height: 250,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10, 
    right: 70,  
    backgroundColor: '#007BFF',
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIconText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  huntsContainer: {
    width: '100%',  
    marginTop: 20,  
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'left',  
    marginBottom: 10,
    marginTop: 20,  
  },
  huntItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 0,
    paddingVertical: 0,
  },
  huntTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',  
    marginBottom: 5,
  },
  noHuntsText: {
    color: 'black',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  noParticipantsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 5,
  },
  invitedUserProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  createHuntButton: {
    backgroundColor: '#007BFF',
    borderColor: '#000',
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 0,
    marginbottom: 40,
    alignSelf: 'flex-start',
  },
  createHuntButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


  medalItem: {
    flexDirection: 'column',
    margin: 5, 
    alignItems: 'center',
    width: 100, 
  },
  medalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  medalTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  medalColumnWrapper: {
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
  },
  noMedalsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  participantName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
});

export default styles;
