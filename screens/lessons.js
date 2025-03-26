import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from "firebase/auth"; 
import { getDatabase, ref, get } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LessonScreen = ({ navigation }) => {
  const [lesson1Score, setLesson1Score] = useState(0);
  const [lesson2Score, setLesson2Score] = useState(0);
  const [lessonsUnlocked, setLessonsUnlocked] = useState(false);

  const fetchScores = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to view lessons.");
      return;
    }

    const db = getDatabase();
    const lesson1Ref = ref(db, `users/${user.uid}/user_lesson_1_score`);
    const lesson2Ref = ref(db, `users/${user.uid}/user_lesson_2_score`);

    try {
      const lesson1Snapshot = await get(lesson1Ref);
      const lesson2Snapshot = await get(lesson2Ref);

      const lesson1Score = lesson1Snapshot.exists() ? lesson1Snapshot.val() : 0;
      const lesson2Score = lesson2Snapshot.exists() ? lesson2Snapshot.val() : 0;

      setLesson1Score(lesson1Score);
      setLesson2Score(lesson2Score);

      // Unlock Lesson 2 & 3 if both scores are ≥3
      setLessonsUnlocked(lesson1Score >= 3 && lesson2Score >= 3);
    } catch (error) {
      console.error("Error fetching scores:", error);
      Alert.alert("Error", "Failed to fetch scores. Please try again.");
    }
  };

  // Fetch scores when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchScores();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.header}>
        <MaterialCommunityIcons name="chat" size={30} color="cyan" />
        <Text style={styles.headerText}>Start your career here!</Text>
      </View>

      <View style={styles.lessonsContainer}>
        <TouchableOpacity
          style={styles.lessonCard}
          onPress={() => navigation.navigate('chapters')}
        >
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>Lesson 1</Text>
            <Text style={styles.lessonTitle}>Introductions</Text>
          </View>
          <Image source={require('../assets/module1.png')} style={styles.lessonImage} />
          <TouchableOpacity onPress={() => navigation.navigate('chapters')}>
            <Text style={styles.viewButton}>View</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {lesson1Score >= 3 ? (
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => navigation.navigate('chapters_l2')}
          >
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Lesson 2</Text>
              <Text style={styles.lessonTitle}>Daily Activities</Text>
            </View>
            <Image source={require('../assets/module2.png')} style={styles.lessonImage} />
            <TouchableOpacity onPress={() => navigation.navigate('chapters_l2')}>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <View style={[styles.lessonCard, styles.locked]}>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Lesson 2</Text>
              <Text style={styles.lessonTitle}>Daily Activities</Text>
            </View>
            <Image source={require('../assets/module2.png')} style={styles.lessonImage} />
            <MaterialCommunityIcons name="lock" size={24} color="white" style={styles.lockIcon} />
          </View>
        )}

        {lessonsUnlocked ? (
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => navigation.navigate('chapters_l3')}
          >
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Lesson 3</Text>
              <Text style={styles.lessonTitle}>Social Conversations</Text>
            </View>
            <Image source={require('../assets/module3.png')} style={styles.lessonImage} />
            <TouchableOpacity onPress={() => navigation.navigate('chapters_l3')}>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <View style={[styles.lessonCard, styles.locked]}>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Lesson 3</Text>
              <Text style={styles.lessonTitle}>Social Conversations</Text>
            </View>
            <Image source={require('../assets/module3.png')} style={styles.lessonImage} />
            <MaterialCommunityIcons name="lock" size={24} color="white" style={styles.lockIcon} />
          </View>
        )}
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
    height: hp('50%'), flex: 1, padding: 20, backgroundColor: '#000', alignItems: 'center' },
  logo: { width: 250, height: 200, marginBottom: 10, marginTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'cyan' },
  lessonsContainer: { width: '100%' },
  lessonCard: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'cyan',
  },
  lessonInfo: { flex: 1 },
  lessonTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  viewButton: {
    backgroundColor: 'cyan',
    color: 'black',
    padding: 5,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locked: { opacity: 0.5, position: 'relative' },
  lockIcon: { position: 'absolute', right: 15, top: 20 },
  lessonImage: { marginRight: 10, width: 60, height: 60 },
});

export default LessonScreen;
