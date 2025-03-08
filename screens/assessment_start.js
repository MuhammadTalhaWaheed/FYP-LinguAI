import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AssessmentStartScreen = ({ navigation, route }) => {
  // Retrieve the userId passed from the previous screen
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.contentContainer}>
        <View style={styles.upperBubble}>
          <Text style={styles.bubbleText}>Before we get started!</Text>
        </View>
        <Image source={require('../assets/lingua.png')} style={styles.character} />
        
        <View style={styles.lowerBubbleContainer}>
          <View style={styles.lowerBubble}>
            <Text style={styles.bubbleText}>Let's Take a Short Test First!</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => navigation.navigate('q1', { userId })}  // Pass userId to the next screen (q4)
      >
        <Text style={styles.buttonText}>Start your assessment</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start', 
    marginVertical: 40,
  },
  upperBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    width: '60%', 
    marginLeft:80,
    marginTop:20,
  },
  lowerBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft:70,
    width:'100%'
  },
  lowerBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginTop:-20,
    elevation: 5,
    width: '60%', 
    marginLeft: 10, 
  },
  bubbleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#2D3FDE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    marginBottom: 80,
    marginLeft: 25,
    width: 300,
  },
  character: {
    width: 70,
    height: 70,
    marginleft: 100,
    marginTop:-40, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 60,
  },
});

export default AssessmentStartScreen;