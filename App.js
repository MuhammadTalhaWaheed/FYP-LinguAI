import React from 'react';
import { initializeApp } from '@firebase/app';

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
import Question3Screen from './screens/q3';
import Question1Screen from './screens/q1';
import Question2Screen from './screens/q2';
import AssessmentEndScreen from './screens/assessment_end';
import LevelScreen from './screens/level';

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
        <Stack.Screen name='q3' component={Question3Screen}/>
        <Stack.Screen name='q2' component={Question2Screen}/>
        <Stack.Screen name='q1' component={Question1Screen}/>
        <Stack.Screen name="assessment_end" component={AssessmentEndScreen}/>
        <Stack.Screen name='level' component={LevelScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
