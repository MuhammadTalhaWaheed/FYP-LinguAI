import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Question1Screen = ({ navigation }) => {
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
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('Recording URI is invalid or null.');

      console.log('Recording URI:', uri);
      setRecording(null);

      // Upload the audio file to the API
      const response = await uploadAudioToAPI(uri);
      if (!response) {
        throw new Error('Failed to upload audio to API.');
      }

      // Save the recording URL (received from API) to Firestore
      await saveVoiceAnswer(response.audioUrl);

      // Navigate to the next question
      navigation.navigate('q2');
    } catch (err) {
      console.error('Error in stopRecordingAndSave:', err);
    }
  };

  const uploadAudioToAPI = async (uri) => {
    try {
      console.log('Fetching file from URI:', uri);
      const response = await fetch(uri);
      console.log('File fetched, converting to blob...');
      const blob = await response.blob();

      console.log('Blob created:', blob);
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: `audio-${Date.now()}.mp3`,
        type: 'audio/mp3',
      });

      // Replace 'your-api-endpoint' with your API URL
      const apiResponse = await fetch('your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to upload audio to API');
      }

      const result = await apiResponse.json();
      console.log('API Response:', result);
      return result;  // Assuming the response contains { audioUrl }
    } catch (error) {
      console.error('Error uploading audio to API:', error);
      return null;
    }
  };

  const saveVoiceAnswer = async (response) => {
    const auth = getAuth(); // Initialize Firebase Auth
    const userId = auth.currentUser?.uid; // Get the current user's UID

    if (userId) {
      const db = getFirestore(); // Initialize Firestore

      try {
        // Save the voice recording URL under the user's document
        await setDoc(doc(db, 'user_answers', userId), {
          q1: { // Storing the answer for Question 1
            questionId: 'q1',
            audioUrl: response.audioUrl, // The audio URL returned by the API
            timestamp: new Date(),
          },
        }, { merge: true }); // Use merge to avoid overwriting other answers

        console.log('Voice answer saved to Firestore!');
      } catch (error) {
        console.error('Error saving voice answer:', error);
      }
    } else {
      console.log('No user is logged in!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNumber}>Q1. Speak about your daily routine in a few sentences.</Text>
        <Text style={styles.timeLimit}>(max 30s)</Text>
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
    marginLeft: 10,
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
  timeLimit: {
    fontSize: 16,
    color: 'cyan',
    marginLeft: 115,
    margin: 10,
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: 'white',
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

export default Question1Screen;
