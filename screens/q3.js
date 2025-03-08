import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore methods
import { getAuth } from "firebase/auth"; // Firebase Auth
import { useNavigation } from "@react-navigation/native"; // Navigation hook

const saveAnswer = async (selectedText) => {
  const auth = getAuth(); // Initialize Firebase Auth
  const userId = auth.currentUser?.uid; // Get the current user's UID

  if (userId) {
    const db = getFirestore(); // Initialize Firestore

    try {
      // Save the transcription under the user's ID and question ID
      await setDoc(
        doc(db, "user_answers", userId),
        {
          answer3: selectedText, // Save transcription as the answer for Question 3
        },
        { merge: true }
      );
      console.log("Answer saved successfully!");
    } catch (error) {
      console.error("Error saving answer: ", error);
    }
  } else {
    console.error("No user is logged in! Redirecting to login.");
  }
};

const Question3Screen = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation(); // Navigation hook

  const apiKey = "d165f0d262e04e9ca4e64362d7c5a0b2"; // Replace with your AssemblyAI API key
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
      }, 30000); // Automatically stop recording after 30 seconds
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      sendAudioToAssemblyAI(uri);
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

          // Save the transcription and navigate to the next screen
          await saveAnswer(transcriptionText);
          navigation.navigate("q4");
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
          Q3. Repeat the following sentence: 'The quick brown fox jumps over the lazy dog'.
        </Text>
        <Text style={styles.timeLimit}>(max 30s)</Text>
      </View>
  
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[
              styles.progressDot,
              dot === 3 && styles.activeDot,
              dot < 3 && styles.completedDot,
            ]}
          />
        ))}
      </View>
  
      {/* Audio Visualization */}
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

export default Question3Screen;
