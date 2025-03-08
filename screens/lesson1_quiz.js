import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, set } from 'firebase/database';  // Import Firebase Realtime Database
import { getAuth } from 'firebase/auth';

const Lesson1_quiz = ({ navigation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState('');

  const playAudio = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Microphone permission is required to record audio');
        return;
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      setRecording(null);
      Alert.alert('Recording Saved', 'Your response has been recorded.');
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const submitAssessment = async () => {
    let score = 0;
  
    if (selectedAnswer === "greeting") score += 1;
    if (fillBlankAnswer.trim().toLowerCase() === "like") score += 1;
    if (multipleChoiceAnswer === "A") score += 1;
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert("Error", "You must be logged in to save your score.");
      return;
    }
  
    const db = getDatabase();
    const userScoreRef = ref(db, `users/${user.uid}/user_lesson_1_score`);
  
    try {
      await set(userScoreRef, score);
      Alert.alert("Assessment Submitted", `Your score is: ${score}/3 and saved successfully.`);
    } catch (error) {
      console.error("Error saving score:", error);
      Alert.alert("Error", "Failed to save your score. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lesson 1 Assessment</Text>

      {/* Dropdown */}
      <View style={styles.section}>
      <Text style={styles.question}>Match the phrase to its meaning:</Text>
      <Text style={styles.prompt}>“Nice to meet you” →</Text>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedAnswer}
            onValueChange={(itemValue) => setSelectedAnswer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an answer" value="" />
            <Picker.Item label="A greeting when meeting someone for the first time" value="greeting" />
            <Picker.Item label="Saying goodbye" value="goodbye" />
            <Picker.Item label="Asking about someone's well-being" value="well-being" />
          </Picker>
        </View>
      </View>

      {/* Fill in the Blank */}
      <View style={styles.section}>
        <Text style={styles.question}>Fill in the blank:</Text>
        <Text style={styles.prompt}>“I ___ to play football.”</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your answer"
          value={fillBlankAnswer}
          onChangeText={setFillBlankAnswer}
        />
      </View>

      {/* Record Response */}
      <View style={styles.section}>
        <Text style={styles.question}>Record your response:</Text>
        <Text style={styles.prompt}>“Introduce yourself in 3 sentences.”</Text>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <MaterialCommunityIcons name={isRecording ? 'stop-circle' : 'microphone'} size={24} color='white' />
          <Text style={styles.recordButtonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      </View>

      {/* Multiple Choice */}
      <View style={styles.section}>
        <Text style={styles.question}>Which of these is a polite way to say goodbye?</Text>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'A' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('A')}
        >
          <Text style={styles.optionText}>A) See you later</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'B' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('B')}
        >
          <Text style={styles.optionText}>B) Nice to meet you</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'C' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('C')}
        >
          <Text style={styles.optionText}>C) What do you do?</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={submitAssessment}>
        <Text style={styles.submitButtonText}>Submit Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#000000',  // Black background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#FF6F00',  // Orange title text
  },
  section: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'cyan',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: '#ffffff',  // White text for questions
  },
  prompt: {
    fontSize: 18,
    marginVertical: 5,
    color: '#00B8D4',  // Cyan for prompts
  },
  input: {
    height: 40,
    borderColor: '#FF6F00',  // Orange border
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',  // White input box
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6F00',  // Orange button background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 20,
  },
  recordButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  option: {
    backgroundColor: '#333333',  // Dark background for options
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  selectedOption: {
    backgroundColor: '#00B8D4',  // Cyan when selected
  },
  optionText: {
    color: 'white',  // White text for MCQ options
  },
  submitButton: {
    backgroundColor: '#FF6F00',  // Orange submit button
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
    marginVertical: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',  // White dropdown
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF6F00',  // Orange border for picker
  },
});

export default Lesson1_quiz;
