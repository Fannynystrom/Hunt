import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    //absoluteFillObject för att den alltid ska ta upp hela skärmen oavsett om du flyttar kartan
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    //knappen placeras imitten oavsett om du rör kartan
    createHuntButton: {
      position: 'absolute',
      bottom: 30,
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
   });


export default styles;
