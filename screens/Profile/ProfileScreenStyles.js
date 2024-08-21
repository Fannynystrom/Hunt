import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
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

  // behållaren för Planned Hunts och Active Hunts
  huntsContainer: {
    width: '100%',  
    marginTop: 20,  
  },

  // rubrikerna Planned Hunts och Active Hunts
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'left',  
    marginBottom: 10,  
  },

  // Stil för varje "hunt" objekt
  huntItem: {
    flexDirection: 'row',  
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  huntTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',  
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  noHuntsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
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
    marginTop: 60,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  createHuntButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  medalsContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F8F8',
    width: '100%',
    marginTop: 60,
  },
  medalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default styles;
