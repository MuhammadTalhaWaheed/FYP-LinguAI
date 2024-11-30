import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

const Question4Screen = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const currentQuestion = 4;

  const options = [
    { id: 'A', text: '"She goes to school every day."' },
    { id: 'B', text: '"She go to school every day."' },
    { id: 'C', text: '"She going to school every day."' },
    { id: 'D', text: '"She had going to school every day."' },
  ];

  const handleSelect = async (option) => {
    setSelectedOption(option.id);

    await saveAnswer(option.text); 

    // Navigate to the next question
    navigation.navigate('q5');
  };

  // Function to save selected answer to Firestore
  const saveAnswer = async (selectedText) => {
    const auth = getAuth(); // Initialize Firebase Auth
    const userId = auth.currentUser?.uid; // Get the current user's UID
  
    if (userId) {
      const db = getFirestore(); // Initialize Firestore
  
      try {
        // Save the selected answer to Firestore under the user's ID and question ID
        await setDoc(
          doc(db, 'user_answers', userId),
          {
            answer4: selectedText, // Dynamically storing answer for Question 4
          },
          { merge: true }
        );
        console.log('Answer saved successfully!');
      } catch (error) {
        console.error('Error saving answer: ', error);
      }
    } else {
      console.error('No user is logged in! Redirecting to login.');
      navigation.navigate('Login'); // Redirect to login screen if no user is logged in
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Question Section */}
      <View style={styles.questionContainer}>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>Q4. Choose the correct option</Text>
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
              dot === 4 && styles.activeDot,
              dot < 4 && styles.completedDot,
            ]}
          />
        ))}
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOption,
            ]}
            onPress={() => handleSelect(option)} // Pass the entire option object
          >
            <Text style={styles.optionId}>{option.id}</Text>
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginLeft: 90,
    elevation: 5,
    marginRight: 80,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  optionsContainer: {
    flex: 1,
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  selectedOption: {
    borderColor: '#2D3FDE',
    backgroundColor: 'cyan',
  },
  optionId: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3FDE',
    marginRight: 5,
  },
  optionText: {
    fontSize: 14,
    color: 'black',
    paddingVertical: 5,
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
});

export default Question4Screen;
