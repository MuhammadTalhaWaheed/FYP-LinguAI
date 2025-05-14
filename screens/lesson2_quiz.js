import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, set, push } from 'firebase/database';  
import { getAuth } from 'firebase/auth';
import { Audio } from 'expo-av';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { collection, addDoc } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const saveAnswer = async (selectedText, pronunciation, completeness, fluency, accuracy) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error("No user logged in!");
    return;
  }

  try {
    // Save only metadata to Firestore (no audio URL)
    const db = getFirestore();
    await setDoc(doc(db, "quiz_answers", user.uid), {
      answer2: {
        userEmail: user.email,
        transcription: selectedText,
        pronunciation,
        completeness,
        fluency,
        accuracy,
        timestamp: new Date()
      }
    }, { merge: true });

    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};


const Lesson2_quiz = ({ navigation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState('');
  const [recognizedText, setRecognizedText] = useState("");
  
    const [pronunciation, setpronunciation] = useState("");
    const [accuracy, setaccuracy] = useState("");
    const [fluency, setfluency] = useState("");
    const [completeness, setcompleteness] = useState("");

  const playAudio = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };


  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "You need to grant audio permissions.");
        return;
      }
  
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
  
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  const stopRecording = async () => {
    if (!recording) {
      console.warn("No active recording found.");
      return;
    }
  
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording saved at:", uri);
      setRecording(null);
      setIsRecording(false);
      sendAudioToBackend(uri);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };
  
  const sendAudioToBackend = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("audio", { // Change "file" to "audio"
        uri: uri,
        name: "recording.3gp", 
        type: "audio/3gp", 
      });
  
      const response = await fetch("https://fyp-linguai.onrender.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const text = await response.text();
      console.log("Raw response:", text);
  
      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
      if (data.recognized_text) {
        setRecognizedText(data.recognized_text);
      }
      setpronunciation(data.pronunciation);
        setcompleteness(data.completeness);
        setfluency(data.fluency);
        setaccuracy(data.accuracy);
        
        saveAnswer(data.recognized_text,data.pronunciation_score,data.completeness_score,data.fluency_score,data.accuracy_score);
        
  
      Alert.alert("Success", "Audio file uploaded successfully!");
    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Upload Failed", "Could not upload the audio file.");
    }
  };
  
  const submitAssessment = async () => {
    let score = 0;
  
    if (selectedAnswer === "wake") score += 1;
    if (fillBlankAnswer.trim().toLowerCase() === "brush") score += 1;
    if (multipleChoiceAnswer === "B") score += 1;
  
    const auth = getAuth();
        const user = auth.currentUser;
      
        if (!user) {
          Alert.alert("Error", "You must be logged in to save your score.");
          return;
        }
        console.log("Current user:", user);
        
        // Initialize Firestore
        const db = getFirestore();
        
        // Reference to the user's score in Firestore
        const userScoreRef = doc(db, `users/${user.uid}/scores`, 'lesson_2');
        
        try {
          // Save the score document
          await setDoc(userScoreRef, { score: score });
          let feedback = '';
          
          if (score === 3) {
            feedback = 'Excellent work! You aced Lesson 2.';
            Alert.alert("Assessment Submitted");
            navigation.navigate('l3_chapter1');
          } else {
            feedback = 'Keep trying! Review Lesson 2 and try again.';
            Alert.alert("You couldn't pass the quiz. Try again!");
          }
      
          // Save the progress in Firestore
          const progress = {
            lesson: 'Lesson 2',
            score: score,
            feedback: feedback,
            date: new Date().toISOString(),
            badgeUrl: '../assets/logo.png',
          };
          
          // Create a progress document for the user
          const progressRef = collection(db, `users/${user.uid}/progress`);
          await addDoc(progressRef, progress);
      
          // If score is 3, create an achievement document
          if (score >= 2) {
            const newAchievement = {
              title: "Beginner Lesson 2 Passed",
              description: "You successfully passed Beginner Lesson 2!",
              date: new Date().toISOString(),
              badgeUrl: '../assets/logo.png',
            };
            
            const achievementRef = collection(db, `users/${user.uid}/achievements`);
            await addDoc(achievementRef, newAchievement);
          }
      
        } catch (error) {
          console.error("Error saving score:", error);
          Alert.alert("Error", "Failed to save your score. Please try again.");
        }
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lesson 2 Assessment</Text>

      {/* Dropdown */}
      <View style={styles.section}>
      <Text style={styles.question}>Match the phrase to its meaning:</Text>
      <Text style={styles.prompt}>“7 o’clock refers to ” →</Text>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedAnswer}
            onValueChange={(itemValue) => setSelectedAnswer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an answer" value="" />
            <Picker.Item label="Morning time to wake up" value="wake" />
            <Picker.Item label="Saying goodbye" value="goodbye" />
            <Picker.Item label="Sleeping time" value="sleep" />
          </Picker>
        </View>
      </View>

      {/* Fill in the Blank */}
      <View style={styles.section}>
        <Text style={styles.question}>Fill in the blank:</Text>
        <Text style={styles.prompt}>“I ___ my teeth in the morning.”</Text>
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
        <Text style={styles.prompt}>“Describe your morning routine in 3 sentences.”</Text>
        <TouchableOpacity
  style={styles.recordButton}
  onPress={isRecording ? stopRecording : startRecording}
>
  <MaterialCommunityIcons name={isRecording ? 'stop-circle' : 'microphone'} size={24} color='white' />
  <Text style={styles.recordButtonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
</TouchableOpacity>
<View style={styles.section}>
  <Text style={styles.question}>Recognized Text:</Text>
  <Text style={styles.recognizedText}>{recognizedText || "No text recognized yet"}</Text>
</View>

      </View>

      {/* Multiple Choice */}
      <View style={styles.section}>
        <Text style={styles.question}>Which of these is an evening activity?</Text>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'A' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('A')}
        >
          <Text style={styles.optionText}>A) Brush my teeth</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'B' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('B')}
        >
          <Text style={styles.optionText}>B) Watch TV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, multipleChoiceAnswer === 'C' && styles.selectedOption]}
          onPress={() => setMultipleChoiceAnswer('C')}
        >
          <Text style={styles.optionText}>C) Eat lunch</Text>
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
  recognizedText: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  
  text: {
    fontSize: wp('5%'), // Text scales with screen width
  },
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

export default Lesson2_quiz;