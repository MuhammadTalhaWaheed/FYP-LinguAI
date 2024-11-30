import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';
import { db, storage } from '../firebaseConfig'; 

const Question2Screen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [timer, setTimer] = useState(0);
  const maxTime = 30;

  useEffect(() => {
    let interval = null;
    if (recording && timer < maxTime) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (timer >= maxTime && recording) {
      stopRecordingAndSave(); 
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = async () => {
    if (!recording) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setTimer(0);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    } else {
      await stopRecordingAndSave();
    }
  };

  const stopRecordingAndSave = async () => {
    setRecording(null);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stored at', uri);

      // Save the answer to the backend
      await sendAudioToAPI(uri);

      navigation.navigate('q3'); // Navigate to the next question
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const sendAudioToAPI = async (uri) => {
    try {
      // Get the blob from URI
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create FormData to send to the API
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'audio/wav',  // Adjust type based on the audio format
        name: 'audio.wav',  // The filename
      });

      // Make the API request
      const apiUrl = 'https://your-api-endpoint.com/upload'; // Replace with your actual API endpoint
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to upload audio');
      }

      const result = await res.json();
      console.log('API response:', result);
      // Optionally, save the result to Firebase or navigate to another screen
    } catch (error) {
      console.error('Error sending audio to API:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNumber}>Q2. Tell me about a place you would like to visit and why.</Text>
        <Text style={styles.timeLimit}>(max 30s)</Text>
      </View>

      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[styles.progressDot, dot === 2 && styles.activeDot, dot < 2 && styles.completedDot]}
          />
        ))}
      </View>

      <View style={styles.audioVisualization}>
        {[...Array(30)].map((_, index) => (
          <View
            key={index}
            style={[styles.audioBar, { height: recording ? Math.random() * 40 + 10 : 20 }]}
          />
        ))}
      </View>

      <Text style={styles.timer}>{formatTime(timer)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.recordButton, recording && styles.recordingButton]}
          onPress={toggleRecording}
        >
          <View style={styles.innerButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    logo: {
      width: 200,
      height: 200,
      marginLeft:10,
    },
    questionBox: {
      backgroundColor: 'grey',
      padding: 20,
      borderRadius: 15,
      marginTop: 20,
      elevation: 5,
    },
    questionNumber: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
    },
    questionText: {
      fontSize: 18,
      color: 'white',
      marginBottom: 5,
    },
    timeLimit: {
      fontSize: 16,
      color: 'cyan',
      marginLeft:115,
      margin:10,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 30,
    },
    progressDot: {
      width: 15,
      height: 15,
      borderRadius: 10,
      backgroundColor: '#ddd',
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: '#2D3FDE',
    },
    completedDot: {
      backgroundColor: '#BBB',
    },
    audioVisualization: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 40,
      marginVertical: 20,
    },
    audioBar: {
      width: 3,
      backgroundColor: '#2D3FDE',
      borderRadius: 1.5,
    },
    timer: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginVertical: 20,
      color:'white'
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    recordButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    recordingButton: {
      backgroundColor: 'yellow',
  
  
    },
    innerButton: {
      width: 75,
      height: 75,
      borderRadius: 45,
      backgroundColor: '#FF4444',
      
    },
  });
  
export default Question2Screen;
