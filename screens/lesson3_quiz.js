import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Picker } from '@react-native-picker/picker';

const Lesson3_quiz = ({ navigation }) => {
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

  const submitAssessment = () => {
    Alert.alert('Assessment Submitted', 'Your answers have been recorded.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lesson 1 Assessment</Text>

      {/* Dropdown */}
      <View style={styles.section}>
      <Text style={styles.question}>Match the phrase to situation:</Text>
      <Text style={styles.prompt}>“It’s sunny” →</Text>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedAnswer}
            onValueChange={(itemValue) => setSelectedAnswer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an answer" value="" />
            <Picker.Item label="Talking about weather" value="weather" />
            <Picker.Item label="Playing video games" value="games" />
            <Picker.Item label="Asking about the taste of the food" value="food" />
          </Picker>
        </View>
      </View>

      {/* Fill in the Blank */}
      <View style={styles.section}>
        <Text style={styles.question}>Fill in the blank:</Text>
        <Text style={styles.prompt}>“I ___ coffee over tea.”</Text>
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
        <Text style={styles.prompt}>“Talk about today's weather.”</Text>
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
        <Text style={styles.question}>Which of these is a compliment?</Text>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'A' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('A')}
        >
          <Text style={styles.optionText}>A) How are you?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'B' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('B')}
        >
          <Text style={styles.optionText}>B) You look great!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'C' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('C')}
        >
          <Text style={styles.optionText}>C) I like coffee.</Text>
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

export default Lesson3_quiz;
