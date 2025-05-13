import React from 'react';
import { initializeApp } from '@firebase/app';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/welcome';
import SplashScreen from './screens/start';
import SignUpScreen from './screens/signup';
import LoginScreen from './screens/login';
import ForgotPassword from './screens/forgot';
import AssessmentStartScreen from './screens/assessment_start';
import Question5Screen from './screens/q5';
import Question4Screen from './screens/q4';
import Question3Screen from './screens/q3a';
import Question1Screen from './screens/q1';
import Question2Screen from './screens/q2';
import AssessmentEndScreen from './screens/assessment_end';
import LevelScreen from './screens/level';
import HomeScreen from './screens/home';
import B1_HomeScreen from './screens/home2';

import LessonScreen from './screens/lessons';
import ChapterScreen from './screens/chapters';
import l2_ChapterScreen from './screens/chapters_l2';
import l3_ChapterScreen from './screens/chapters_l3';


import B1_LessonScreen from './screens/B1_lessons';
import B1_ChapterScreen from './screens/B1_chapters';
import B1_l2_ChapterScreen from './screens/B1_chapters_l2';
import B1_l3_ChapterScreen from './screens/B1_chapters_l3';


import B1_Chapter1Screen from './screens/B1_Chapter1';
import B1_Chapter2Screen from './screens/B1_Chapter2';
import B1_Chapter3Screen from './screens/B1_Chapter3';
import B1_Chapter4Screen from './screens/B1_Chapter4';
import B1_Chapter5Screen from './screens/B1_Chapter5';
import B1_Lesson1_quiz from './screens/B1_lesson1_quiz';

import B1_l2_Chapter1Screen from './screens/B1_l2_chapter1';
import B1_l2_Chapter2Screen from './screens/B1_l2_chapter2';
import B1_l2_Chapter3Screen from './screens/B1_l2_chapter3';
import B1_l2_Chapter4Screen from './screens/B1_l2_chapter4';
import B1_l2_Chapter5Screen from './screens/B1_l2_chapter5';
import B1_Lesson2_quiz from './screens/B1_lesson2_quiz';
import B1_Lesson3_quiz from './screens/B1_lesson3_quiz';

import Lesson_award_inter_to_adv from './screens/lesson_award_inter_to_adv';
import B1_l3_Chapter1Screen from './screens/B1_l3_chapter1';
import B1_l3_Chapter2Screen from './screens/B1_l3_chapter2';
import B1_l3_Chapter3Screen from './screens/B1_l3_chapter3';
import B1_l3_Chapter4Screen from './screens/B1_l3_chapter4';
import B1_l3_Chapter5Screen from './screens/B1_l3_chapter5';

import Chapter1Screen from './screens/Chapter1';
import Chapter2Screen from './screens/Chapter2';
import Chapter3Screen from './screens/Chapter3';
import Chapter4Screen from './screens/Chapter4';
import Chapter5Screen from './screens/Chapter5';
import Lesson1_quiz from './screens/lesson1_quiz';

import l2_Chapter1Screen from './screens/l2_chapter1';
import l2_Chapter2Screen from './screens/l2_chapter2';
import l2_Chapter3Screen from './screens/l2_chapter3';
import l2_Chapter4Screen from './screens/l2_chapter4';
import l2_Chapter5Screen from './screens/l2_chapter5';
import Lesson2_quiz from './screens/lesson2_quiz';
import Lesson3_quiz from './screens/lesson3_quiz';

import AchievementsAndAwards from './screens/AchievementsAndAwards';
import PersonalInfo from './screens/PersonalInfo';
import TrackYourProgress from './screens/TrackYourProgress';

import Lesson_award_beg_to_inter from './screens/lesson_award_beg_to_inter';
import l3_Chapter1Screen from './screens/l3_chapter1';
import l3_Chapter2Screen from './screens/l3_chapter2';
import l3_Chapter3Screen from './screens/l3_chapter3';
import l3_Chapter4Screen from './screens/l3_chapter4';
import l3_Chapter5Screen from './screens/l3_chapter5';
import QuizResults from './screens/progress';

const firebaseConfig = {
  apiKey: "AIzaSyAz5l_N81gYP4uh9gJBU0VxL5KfUrT-GbQ",
  authDomain: "linguaai-ab6ae.firebaseapp.com",
  projectId: "linguaai-ab6ae",
  storageBucket: "linguaai-ab6ae.firebasestorage.app",
  messagingSenderId: "596304930103",
  appId: "1:596304930103:web:74ee12acb9458ae4db26b2",
  measurementId: "G-QPN2XF4QG5"
};

const Stack = createStackNavigator();
const app =initializeApp(firebaseConfig);
export default function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="signup" component={SignUpScreen}/>
        <Stack.Screen name="login" component={LoginScreen}/>
        <Stack.Screen name="forgot" component={ForgotPassword}/>
        <Stack.Screen name="assessment_start" component={AssessmentStartScreen}/>
        <Stack.Screen name='q5' component={Question5Screen}/>
        <Stack.Screen name='q4' component={Question4Screen}/>
        <Stack.Screen name='q3a' component={Question3Screen}/>
        <Stack.Screen name='q2' component={Question2Screen}/>
        <Stack.Screen name='q1' component={Question1Screen}/>
        <Stack.Screen name="assessment_end" component={AssessmentEndScreen}/>
        <Stack.Screen name='level' component={LevelScreen}/>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='home2' component={B1_HomeScreen}/>

        <Stack.Screen name='lessons' component={LessonScreen}/>
        <Stack.Screen name='chapters' component={ChapterScreen}/>
        
        <Stack.Screen name='B1_lessons' component={B1_LessonScreen}/>
        <Stack.Screen name='B1_chapters' component={B1_ChapterScreen}/>


        <Stack.Screen name='Chapter1' component={Chapter1Screen}/>
        <Stack.Screen name='Chapter2' component={Chapter2Screen}/>
        <Stack.Screen name='Chapter3' component={Chapter3Screen}/>
        <Stack.Screen name='Chapter4' component={Chapter4Screen}/>
        <Stack.Screen name='Chapter5' component={Chapter5Screen}/>
        <Stack.Screen name='lesson1_quiz' component={Lesson1_quiz}/>
        <Stack.Screen name='chapters_l2' component={l2_ChapterScreen}/>

        <Stack.Screen name='l2_chapter1' component={l2_Chapter1Screen}/>
        <Stack.Screen name='l2_chapter2' component={l2_Chapter2Screen}/>
        <Stack.Screen name='l2_chapter3' component={l2_Chapter3Screen}/>
        <Stack.Screen name='l2_chapter4' component={l2_Chapter4Screen}/>
        <Stack.Screen name='l2_chapter5' component={l2_Chapter5Screen}/>
        <Stack.Screen name='lesson2_quiz' component={Lesson2_quiz}/>

        <Stack.Screen name='chapters_l3' component={l3_ChapterScreen}/>
        <Stack.Screen name='l3_chapter1' component={l3_Chapter1Screen}/>
        <Stack.Screen name='l3_chapter2' component={l3_Chapter2Screen}/>
        <Stack.Screen name='l3_chapter3' component={l3_Chapter3Screen}/>
        <Stack.Screen name='l3_chapter4' component={l3_Chapter4Screen}/>
        <Stack.Screen name='l3_chapter5' component={l3_Chapter5Screen}/>
        <Stack.Screen name='lesson3_quiz' component={Lesson3_quiz}/>


        <Stack.Screen name='B1_Chapter1' component={B1_Chapter1Screen}/>
        <Stack.Screen name='B1_Chapter2' component={B1_Chapter2Screen}/>
        <Stack.Screen name='B1_Chapter3' component={B1_Chapter3Screen}/>
        <Stack.Screen name='B1_Chapter4' component={B1_Chapter4Screen}/>
        <Stack.Screen name='B1_Chapter5' component={B1_Chapter5Screen}/>
        <Stack.Screen name='B1_lesson1_quiz' component={B1_Lesson1_quiz}/>
        <Stack.Screen name='B1_chapters_l2' component={B1_l2_ChapterScreen}/>

        <Stack.Screen name='B1_l2_chapter1' component={B1_l2_Chapter1Screen}/>
        <Stack.Screen name='B1_l2_chapter2' component={B1_l2_Chapter2Screen}/>
        <Stack.Screen name='B1_l2_chapter3' component={B1_l2_Chapter3Screen}/>
        <Stack.Screen name='B1_l2_chapter4' component={B1_l2_Chapter4Screen}/>
        <Stack.Screen name='B1_l2_chapter5' component={B1_l2_Chapter5Screen}/>
        <Stack.Screen name='B1_lesson2_quiz' component={B1_Lesson2_quiz}/>

        <Stack.Screen name='B1_chapters_l3' component={B1_l3_ChapterScreen}/>
        <Stack.Screen name='B1_l3_chapter1' component={B1_l3_Chapter1Screen}/>
        <Stack.Screen name='B1_l3_chapter2' component={B1_l3_Chapter2Screen}/>
        <Stack.Screen name='B1_l3_chapter3' component={B1_l3_Chapter3Screen}/>
        <Stack.Screen name='B1_l3_chapter4' component={B1_l3_Chapter4Screen}/>
        <Stack.Screen name='B1_l3_chapter5' component={B1_l3_Chapter5Screen}/>
        <Stack.Screen name='B1_lesson3_quiz' component={B1_Lesson3_quiz}/>

        <Stack.Screen name='lesson_award_beg_to_inter' component={Lesson_award_beg_to_inter}/>
        <Stack.Screen name='lesson_award_inter_to_adv' component={Lesson_award_inter_to_adv}/>

        <Stack.Screen name='progress' component={QuizResults}/>
        <Stack.Screen name='AchievementsAndAwards' component={AchievementsAndAwards}/>
        <Stack.Screen name='PersonalInfo' component={PersonalInfo}/>
        <Stack.Screen name='TrackYourProgress' component={TrackYourProgress}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
