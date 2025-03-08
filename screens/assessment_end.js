import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';

const LoadingSpinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]); // Added spinValue as dependency

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    >
      {[...Array(8)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.spinnerDot,
            {
              transform: [
                { rotate: `${index * 45}deg` },
                { translateX: 30 },
              ],
              opacity: 1 - (index * 0.1),
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

const AssessmentEndScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Message Bubble and Character */}
      <View style={styles.messageContainer}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            We are examining your level of speaking!
          </Text>
        </View>
      </View>
      
      <View style={styles.characterContainer}>
        <Image 
          source={require('../assets/lingua.png')} 
          style={[styles.character, { transform: [{ scaleX: -1 }] }]} 
        />
      </View>

      {/* Loading Spinner */}
      <View style={styles.spinnerContainer}>
        <LoadingSpinner />
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('level')} // Corrected to use an arrow function
      >
        <Text style={styles.startButtonText}>FIND MY LEVEL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  character: {
    width: 70,
    height: 70,
    marginLeft: 200,
    marginTop: -40,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginTop: 50,
    marginRight: 70,
    marginLeft: 50,
    elevation: 5,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  spinnerContainer: {
    height: 200, // Increase the height for the container
    marginBottom: 40,
    marginTop: -50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 120, // Increase width for the spinner
    height: 120, // Increase height for the spinner
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerDot: {
    position: 'absolute',
    width: 15, 
    height: 15,
    borderRadius: 7.5, 
    backgroundColor: '#2D3FDE',
  },
  startButton: {
    backgroundColor: '#2D3FDE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 0,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginLeft: 10,
  },
});

export default AssessmentEndScreen;
