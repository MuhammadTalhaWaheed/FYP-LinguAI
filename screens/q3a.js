import React, { useState } from "react";
import { View, Button, Text, StyleSheet, ActivityIndicator, Image, Alert } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { useNavigation } from "@react-navigation/native"; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const saveAnswer = async (selectedText, pronunciation, completeness, fluency, accuracy) => {
  const auth = getAuth();
const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (userId) {
    const db = getFirestore();
    try {
      await setDoc(doc(db, "user_answers", userId), {
        answer3: {
          transcription: selectedText,
          fluency: fluency,
          completeness: completeness,
          pronunciation: pronunciation,
          accuracy: accuracy
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

const Question3Screen = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
    const [pronunciation, setpronunciation] = useState("");
    const [accuracy, setaccuracy] = useState("");
    const [fluency, setfluency] = useState("");
    const [completeness, setcompleteness] = useState("");

  const navigation = useNavigation();

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
         formData.append("audio", { 
           uri: uri,
           name: "recording_q3.3gp", 
           type: "audio/3gp", 
         });
     
         const response = await fetch("http://172.17.41.194:5000/upload", {
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
       
         setTimeout(() => {
          navigation.navigate('q4');  
        }, 2000);
       } catch (error) {
         console.error("Error uploading audio:", error);
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

       <View style={styles.result}>
                      <Text style={styles.label}>Transcription:</Text>
                      <Text style={styles.text}>{recognizedText}</Text>
                    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: wp('5%'), // Text scales with screen width
  },
  container: {
    width: wp('100%'),  // Takes 90% of screen width
    height: hp('50%'),    flex: 1,
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
