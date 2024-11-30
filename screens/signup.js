import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { auth, createUserWithEmailAndPassword, updateProfile, db, ref, set } from '../firebaseConfig'; // Correct import

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Regular expression to validate email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSignUp = async () => {
    // Check if email format is valid
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user profile with the full name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save user data to Firebase Realtime Database
      const userRef = ref(db, '/users/' + user.uid); // Correct usage of `ref` from Firebase Realtime Database
      await set(userRef, { // Use `set` to store data
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString(),
      });

      console.log('Sign-up successful and user profile added:', user);
      Alert.alert('Sign-up successful', 'Your account has been created successfully!');

      // Navigate to the login screen on success
      navigation.navigate('login');
    } catch (error) {
      console.error('Sign-up failed:', error.message);
      Alert.alert('Sign-up failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        color="white"
      />

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.header}>Create your account!</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            right={<TextInput.Icon name="eye" />}
            style={styles.input}
          />

          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSignUp} // Call handleSignUp on button press
          >
            Sign up
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: 'grey',
    borderRadius: 10,
    paddingVertical: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0056d2',
  },
});

export default SignUpScreen;
