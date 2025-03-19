import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { getAuth } from 'firebase/auth'; // Firebase Auth
const auth = getAuth();

const Question5Screen = ({ navigation }) => {
  const [answer, setAnswer] = useState('');
  const [grammar, setGrammar] = useState(null);
  const [vocab, setVocab] = useState(null);
  const [cohesion, setCohesion] = useState(null);

  const handleTextChange = (text) => {
    setAnswer(text);
  };
  const sendTranscriptionToBackend = async (transcription) => {
    const userId = auth.currentUser?.uid;  // Make sure this is properly set
    const questionNumber = 5;

    try {
      const response = await fetch("http://172.17.41.194:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription,user_id: userId ,question_number: questionNumber}),
      });
  
      const data = await response.json(); // Parse JSON response
      console.log("Received data from backend:", data);
  
      // Update state with parsed data
      setGrammar(data.grammar);
      setVocab(data.vocabulary); // Ensure this matches the backend key
      setCohesion(data.cohesion);
      
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  const handleSubmit = async () => {
    await sendTranscriptionToBackend(answer);

   // await saveAnswer(answer,grammar, vocab, cohesion);

    // Navigate to the assessment end screen
    navigation.navigate('assessment_end'); 
  };

  const saveAnswer = async (textAnswer,grammar, vocab, cohesion) => {
    const auth = getAuth(); // Get the current user
    const userId = auth.currentUser?.uid; // Get the user ID (ensure the user is logged in)

    if (userId) {
      const db = getFirestore(); // Get Firestore instance

      try {
        // Save the answer to Firestore under the user's ID and field 'answer5'
        await setDoc(doc(db, 'user_answers', userId), {
          answer5: {
            transcription: textAnswer,
              grammar: grammar,
              vocabulary: vocab,
              cohesion: cohesion

          }, // Save the answer to the field 'answer5'
        }, { merge: true }); // Merge with existing data
        console.log('Answer saved successfully!');
      } catch (error) {
        console.error('Error saving answer: ', error);
      }
    } else {
      console.log('No user logged in!');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Question Section */}
      <View style={styles.questionContainer}>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            Q5. In one or two sentences, explain why you want to improve your English.
          </Text>
        </View>
      </View>
      
      <View style={styles.characterContainer}>
        <Image source={require('../assets/lingua.png')} style={styles.character} />
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[
              styles.progressDot,
              dot === 5 && styles.activeDot,
              dot < 5 && styles.completedDot,
            ]}
          />
        ))}
      </View>

      {/* Text Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your answer"
          multiline
          textAlignVertical="top"
          value={answer}
          onChangeText={handleTextChange}
          maxLength={500}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  character: {
    width: 70,
    height: 70,
    marginLeft: -250,
    marginTop: -60,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    borderRadius: 15,
    marginRight: 50,
    elevation: 5,
    marginLeft: 80,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#2D3FDE',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Question5Screen;
