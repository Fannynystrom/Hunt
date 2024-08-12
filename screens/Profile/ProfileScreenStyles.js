import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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


    // Container för profilbild och redigeringsikon
  imageContainer: {
    position: 'relative',
    marginBottom: 20,

  },
    // profilbilden
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4, 
    borderColor: 'black', 
  },
    //  platshållarbilden (visas om ingen bild finns)
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
    // container för redigeringsikon
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#fff', 
  },
    // pennan i redigeringsikon
  editIconText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 34,
    fontWeight: 'bold',
  },

  //rubrikerna active hunts och planned hunts
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginHorizontal: 5,
  },

//container för createhunt knappen
  createHuntButton: {
    backgroundColor: '#007BFF',
    borderColor: '#000',
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 30,
    paddingLeft:30,
    borderRadius: 5,
    marginTop: 60,
    marginLeft: 20,
    alignSelf: 'flex-start',

  },
  //texten i knappen createhunt
  createHuntButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //container för "medalj"
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
