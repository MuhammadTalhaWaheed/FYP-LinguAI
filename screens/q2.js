import React, { useState } from "react";
import { View, Button, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { useNavigation } from "@react-navigation/native"; 
const auth = getAuth();

const saveAnswer = async (selectedText, fluency, grammar, vocab, cohesion) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const db = getFirestore();
    try {
      await setDoc(doc(db, "user_answers", userId), {
        answer2: {
          transcription: selectedText,
          fluency: fluency,
          grammar: grammar,
          vocabulary: vocab,
          cohesion: cohesion
        }
      }, { merge: true });
      console.log("Answer and scores saved successfully!");
    } catch (error) {
      console.error("Error saving answer and scores: ", error);
    }
  } else {
    console.error("No user is logged in! Redirecting to login.");
    
  }
};



const calculateFluency = (transcription, durationInSeconds) => {
  const wordCount = transcription.split(" ").length;
  return wordCount / durationInSeconds;  // Fluency in words per second
};


const Question2Screen = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fluency, setFluency] = useState(null);
  const [grammar, setGrammar] = useState(null);
  const [vocab, setVocab] = useState(null);
  const [cohesion, setCohesion] = useState(null);

  const navigation = useNavigation();

  const apiKey = "d165f0d262e04e9ca4e64362d7c5a0b2"; 
  const uploadUrl = "https://api.assemblyai.com/v2/upload";
  const transcriptUrl = "https://api.assemblyai.com/v2/transcript";

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
      durationSeconds = durationMillis / 1000;
      setRecording(null);
  
    
      sendAudioToAssemblyAI(recording.getURI());
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };
  const sendTranscriptionToBackend = async (transcription) => {
    const userId = auth.currentUser?.uid;  // Make sure this is properly set
    const questionNumber = 2;
    const fluencyScore = calculateFluency(transcription, durationSeconds); 

    try {
      const response = await fetch("http://172.16.73.172:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription ,user_id: userId,question_number: questionNumber, fluency: fluencyScore}),
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
  
  const sendAudioToAssemblyAI = async (uri) => {
    setIsLoading(true);
    setTranscription("");  // Clear previous transcription
  
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
          await sendTranscriptionToBackend(transcriptionText);
          
          //await saveAnswer(transcriptionText,fluency, grammar, vocab, cohesion);
          navigation.navigate("q3a");
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNumber}>
        Q2. Tell me about a place you would like to visit and why?        
        </Text>
        <Text style={styles.timeLimit}>(max 30s)</Text>
      </View>

      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[
              styles.progressDot,
              dot === 2 && styles.activeDot,
              dot < 2 && styles.completedDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.audioVisualization}>
        {[...Array(30)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.audioBar,
              {
                height: isRecording ? Math.random() * 40 + 10 : 20,
                backgroundColor: isRecording ? "green" : "grey",
              },
            ]}
          />
        ))}
      </View>

      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
        color={isRecording ? "red" : "green"}
      />

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Processing transcription...</Text>
        </View>
      )}

      {transcription && (
        <View style={styles.result}>
          <Text style={styles.label}>Transcription:</Text>
          <Text style={styles.text}>{transcription}</Text>
          {/* <Text style={styles.label}>Vocabulary Score: {vocab}</Text>
          <Text style={styles.label}>Grammar Score: {grammar}</Text>
          <Text style={styles.label}>Cohesion Score: {cohesion}</Text> */}

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  questionBox: {
    backgroundColor: "grey",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "white",
  },
  timeLimit: {
    fontSize: 16,
    color: "cyan",
    textAlign: "center",
    marginVertical: 10,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  progressDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#2D3FDE",
  },
  completedDot: {
    backgroundColor: "#BBB",
  },
  loader: {
    alignItems: "center",
    marginTop: 20,
  },
  result: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    marginTop: 10,
  },
  audioVisualization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginVertical: 20,
  }
});

export default Question2Screen;
