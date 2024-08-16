import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  createHuntButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  createHuntButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  markerList: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    height: 100,
    backgroundColor: 'white', 
    zIndex: 1000, 
  },
  
  markerOption: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  markerImage: {
    width: 50,
    height: 50,
    backgroundColor: 'red', 
  },
  
});


export default styles;
