import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth methods
import '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth(); // Initialize Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the logged-in user

      console.log('Login successful:', user);

      // Navigate to the next screen after successful login and pass the userId
      navigation.navigate('assessment_start', { userId: user.uid });
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message); // Display an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.header}>Log into your account!</Text>

      <Card style={styles.card}>
        <Card.Content>
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

          {/* Sign In Button */}
          <Button 
            mode="contained" 
            style={styles.button} 
            onPress={handleLogin}
          >
            Sign In
          </Button>

          {/* Forgot Password Link */}
          <Text 
            style={styles.forgotPassword} 
            onPress={() => navigation.navigate('forgot')}
          >
            Forgot password?
          </Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
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
    backgroundColor: 'white'
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0056d2',
  },
  forgotPassword: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
