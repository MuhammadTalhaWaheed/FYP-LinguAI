import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,ScrollView, Image, Alert, Modal, Button } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from 'axios';

const l2_Chapter5Screen = ({ navigation }) => {
  const playAudio = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };
  const [showChatbot, setShowChatbot] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [word, setWord] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'd165f0d262e04e9ca4e64362d7c5a0b2';
  const uploadUrl = 'https://api.assemblyai.com/v2/upload';
  const transcriptUrl = 'https://api.assemblyai.com/v2/transcript';

  const openModal = () => {
    setShowModal(true);
  };

  // Close the modal dialog
  const closeModal = () => {
    setShowModal(false);
  };
  const searchWord = async () => {
    if (word.trim() === '') {
      setSearchResult('Please enter a word.');
      return;
    }

    try {
      // Free Dictionary API endpoint
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        setSearchResult('Word not found or invalid request.');
        return;
      }

      const data = await response.json();

      if (data.title) {
        setSearchResult('Word not found');
      } else {
        // Extract the meaning from the response
        const meanings = data[0].meanings[0].definitions.map(def => def.definition).join(', ');
        setSearchResult(meanings || 'No definition found');
      }
    } catch (error) {
      console.error(error);
      setSearchResult('Error: Unable to fetch meaning');
    }
  };
  
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Microphone permission is required to record audio");
        return;
      }

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
        },
      });

      setRecording(recording);
      setIsRecording(true);

      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000); 
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };
  var durationSeconds;
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const { durationMillis } = await recording.getStatusAsync();  
      durationSeconds= durationMillis / 1000;
      setRecording(null);  
      sendAudioToAssemblyAI(recording.getURI());
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };
  const sendAudioToAssemblyAI = async (uri) => {
    setIsLoading(true);
    setTranscription("");  
  
    try {
      const audioFile = await fetch(uri).then((res) => res.blob());
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          authorization: apiKey,
          "content-type": "application/octet-stream",
        },
        body: audioFile,
      });
  
      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;
  
      const transcriptResponse = await axios.post(
        transcriptUrl,
        { audio_url: audioUrl },
        {
          headers: {
            authorization: apiKey,
            "content-type": "application/json",
          },
        }
      );
  
      const transcriptId = transcriptResponse.data.id;
  
      let transcriptionCompleted = false;
      while (!transcriptionCompleted) {
        const statusResponse = await axios.get(
          `${transcriptUrl}/${transcriptId}`,
          { headers: { authorization: apiKey } }
        );
        const statusData = statusResponse.data;
  
        if (statusData.status === "completed") {
          transcriptionCompleted = true;
          const transcriptionText = statusData.text;
          setTranscription(transcriptionText);
  
          // Send transcription to the backend
        } else if (statusData.status === "failed") {
          setTranscription("Transcription failed. Please try again.");
          break;
        }
  
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (err) {
      console.error("Error during transcription:", err);
      setTranscription("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="book-open-page-variant" size={30} color="cyan" />
        <Text style={styles.headerText}>Putting It All Together</Text>
      </View>

      <View style={styles.section}>
      <TouchableOpacity onPress={openModal}>
        <Image source={require('../assets/lingua.png')} style={styles.characterImage} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✖</Text> {/* Cross icon */}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter word"
              value={word}
              onChangeText={setWord}
            />

            <Button title="Search" onPress={searchWord} />

            {/* Displaying search result */}
            {searchResult ? (
              <Text style={styles.resultText}>Meaning: {searchResult}</Text>
            ) : null}
          </View>
        </View>
      </Modal>
       <Text style={styles.sectionTitle}>Listen</Text>
        <Text style={styles.text}>
          "I wake up at 7 o’clock. I go to school and study math. In the evening, I watch TV and eat dinner. On weekends, I visit my friends."
        </Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio("I wake up at 7 o’clock. I go to school and study math. In the evening, I watch TV and eat dinner. On weekends, I visit my friends.")}
        >
          <MaterialCommunityIcons name="volume-high" size={24} color="white" />
          <Text style={styles.audioButtonText}>Play Audio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversation with User</Text>
        <Text style={styles.text}>What time do you wake up?</Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio("What time do you wake up?")}
        >
          <MaterialCommunityIcons name="volume-high" size={24} color="white" />
          <Text style={styles.audioButtonText}>Play Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'green' }]}
  onPress={isRecording ? stopRecording : startRecording}
>
  <Text style={styles.recordButtonText}>
    {isRecording ? 'Stop Recording' : 'Start Recording'}
  </Text>
</TouchableOpacity>
          <Text style={styles.label}>Transcription:</Text>
          <Text style={styles.text}>{transcription}</Text>
          <Text style={styles.text}>What do you do during the day?</Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio("What do you do during the day?")}
        >
          <MaterialCommunityIcons name="volume-high" size={24} color="white" />
          <Text style={styles.audioButtonText}>Play Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'green' }]}
  onPress={isRecording ? stopRecording : startRecording}
>
  <Text style={styles.recordButtonText}>
    {isRecording ? 'Stop Recording' : 'Start Recording'}
  </Text>
</TouchableOpacity>
          <Text style={styles.label}>Transcription:</Text>
          <Text style={styles.text}>{transcription}</Text>
          <Text style={styles.text}>What do you do on weekends?</Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio("What do you do on weekends?")}
        >
          <MaterialCommunityIcons name="volume-high" size={24} color="white" />
          <Text style={styles.audioButtonText}>Play Text</Text>
        </TouchableOpacity>

      </View>


      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('lesson2_quiz')}>
        <Text style={styles.nextButtonText}>Go to Lesson 2 Assessment →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      openButton: {
        color: '#4CAF50',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        elevation: 3, // Adds shadow to the button
      },
      dialog: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        top: '25%',
        left: '10%',
        right: '10%',
        minWidth: '80%',
        elevation: 5, 
      },
      input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: '#f9f9f9', // Light background for input
      },
      searchButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
      result: {
        marginTop: 10,
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 10,
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
        padding: 5,
      },
      closeButtonText: {
        fontSize: 24,
        color: 'red',
      },
      characterImage: {
        width: 100,
        height: 100,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      closeButtonText: {
        color: 'red',
        fontSize: 18,
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
      },
      searchButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
      result: {
        marginTop: 20,
        fontSize: 16,
        color: 'black',
      },
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop:10,
    color: 'cyan',
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  phraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5e00',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  audioButtonSmall: {
    backgroundColor: '#ff5e00',
    padding: 8,
    borderRadius: 10,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  nextButton: {
    backgroundColor: '#ff5e00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  phraseContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'space-between',  
    width: '100%',  
    paddingVertical: 5,
    paddingHorizontal: 10,  
  },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default l2_Chapter5Screen;
