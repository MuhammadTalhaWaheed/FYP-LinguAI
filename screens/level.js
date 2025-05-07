import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth } from 'firebase/auth'; 
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const saveAnswer = async (score) => {
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  
  if (userId) {
    const db = getFirestore();
    try {
      await setDoc(doc(db, "scores", userId), { i_score: score }, { merge: true });
      console.log("Answer and scores saved successfully!");
    } catch (error) {
      console.error("Error saving answer and scores: ", error);
    }
  } else {
    console.error("No user is logged in! Redirecting to login.");
  }
};

const LevelScreen = ({ navigation }) => {
  const [userLevel, setUserLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const response = await fetch(`https://fyp-linguai.onrender.com/calculate_average_scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();
        console.log(data);
        if (data?.averages) {
          const averages = data.averages;
          const overallScore = (averages.fluency + averages.pronunciation + averages.accuracy + averages.completeness) / 4;
          console.log(overallScore);

          if (overallScore >= 98) {
            setUserLevel('Advanced');


          } else if (overallScore < 98 && overallScore >= 95) {

            setUserLevel('Intermediate');
          } else {
            saveAnswer(overallScore);

            setUserLevel('Beginner');
          }
        } else {
          setUserLevel('No valid scores');
        }
      } catch (error) {
        console.error('Error fetching user scores:', error);
        setUserLevel('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserScores();
    } else {
      setUserLevel('No user ID found');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
  
      <View style={styles.contentContainer}>
        <Text style={styles.upperText}>Congratulations!</Text>
        <Image source={require('../assets/trophy.png')} style={styles.trophy} />
        <Text style={styles.lowerText}>
          You are a <Text style={styles.highlight}>{userLevel}</Text> English Language Speaker!
        </Text>
      </View>
  
      {userLevel === 'Beginner' && (
  <>
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => navigation.navigate('home')}
    >
      <Text style={styles.buttonText}>Go to Welcome Screen</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  </>
)}

{userLevel === 'Intermediate' && (
  <TouchableOpacity
    style={styles.startButton}
    onPress={() => navigation.navigate('home2')}
  >
    <Text style={styles.buttonText}>Proceed to Lessons</Text>
    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
)}

{userLevel === 'Advanced' && (
  <>
    <Text style={styles.warningText}>
      Sorry, we aren't dealing with advanced level students right now.
    </Text>
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => navigation.navigate('welcome')}
    >
      <Text style={styles.buttonText}>Go to Welcome Screen</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  </>
)}

    </View>
  );
  
  
};

const styles = StyleSheet.create({
  text: {
    fontSize: wp('5%'), // Text scales with screen width
  },
  container: {
    width: wp('100%'),  // Takes 90% of screen width
    height: hp('50%'),
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 40,
  },
  upperText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lowerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center', 
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold', 
  },
  trophy: {
    width: 150, 
    height: 150, 
    marginVertical: 20, 
  },
  startButton: {
    backgroundColor: '#2D3FDE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    marginBottom: 40,
    marginLeft: 20,
    marginTop: 40,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  warningText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LevelScreen;
