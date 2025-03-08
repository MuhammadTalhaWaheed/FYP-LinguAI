import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.characterContainer}>
        <View style={styles.speechBubble} />
        <Text style={styles.speechText}>
          {'\n\n\n\t\t'}Hi! I am Lingua!{'\n\t\t'}I will help you{'\n\t\t'} navigate the App!
        </Text>
      </View>
      <Image source={require('../assets/lingua.png')} style={styles.character} />

      <Text style={styles.mainMessage}>
        {'\n\n\n\n'}Before we start learning, 
        {'\n'}let's create an account first!
      </Text>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate('signup')}
      >
        GET STARTED
      </Button>

      <Text style={styles.loginPrompt}>Already have an account?</Text>
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('login')}>LOG IN</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
    marginTop: 40,
  },
  title: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: 'grey',
    padding: 50,
    borderRadius: 10,
    position: 'relative',
    margin: 20,
    marginLeft: 40,
    width: 120,
    height: 80,
  },
  speechText: {
    fontSize: 14,
    color: 'white',
    position: 'absolute',
    top: -20,
    textAlign: 'center',
  },
  character: {
    width: 70,
    height: 70,
    marginLeft: -160,
    marginTop: -70,
  },
  mainMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    marginVertical: 5,
    backgroundColor: '#0056d2',
  },
  loginPrompt: {
    fontSize: 14,
    color: 'white',
    marginTop: 20,
    marginBottom: 5,
  },
});

export default WelcomeScreen;
