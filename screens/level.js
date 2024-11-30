import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LevelScreen = ({ navigation, userId }) => {
  const [userLevel, setUserLevel] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user scores and level from the API
  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const response = await fetch(`https://your-api.com/scores/${userId}`);
        const data = await response.json();
        setUserLevel(data.level); // assuming the API returns a 'level' field
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user level:', error);
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.contentContainer}>
        <Text style={styles.upperText}>Congratulations!</Text>
        
        {/* Trophy Image */}
        <Image 
          source={require('../assets/trophy.png')} // Make sure to have a trophy image
          style={styles.trophy} 
        />
        
        <Text style={styles.lowerText}>
          You are an <Text style={styles.highlight}>{userLevel}</Text> English Language Speaker!
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => navigation.navigate('welcome')}
      >
        <Text style={styles.buttonText}>Start your Career</Text>
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
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 40,
  },
  upperText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lowerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center', 
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold', 
  },
  trophy: {
    width: 150, 
    height: 150, 
    marginVertical: 20, 
  },
  startButton: {
    backgroundColor: '#2D3FDE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    marginBottom: 40,
    marginTop: 40,
    marginLeft:20,
    width: 300,
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
  loadingText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LevelScreen;
