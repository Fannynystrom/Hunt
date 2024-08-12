import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      
    },
    screenTitle: {
      fontSize: 54,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 70,
      color: '#007BFF',

    },
    inputLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2c2c2c',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    imageLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007BFF',
      marginBottom: 20,
      textAlign: 'center',
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 40,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
    },
    imagePlaceholder: {
      fontSize: 36,
      color: '#000',
    },
    continueButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    continueButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default styles;
