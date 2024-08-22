import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  createHuntButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -Dimensions.get('window').width * 0.25 }],
    backgroundColor: '#007AFF',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // För skugga på Android
    shadowColor: '#000', // För skugga på iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  createHuntButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 15,
  },
});
