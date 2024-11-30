import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';

const ForgotPassword = ({ navigation }) => {
  // State variables for password inputs and email
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');  // Add email state
  const [emailError, setEmailError] = useState(''); // State for email error message

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Handle password reset functionality
  const handleForgotPassword = async () => {
    // Validate that the passwords match
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Validate email format
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError(''); // Clear error message if email is valid
    }

    try {
      const response = await fetch('http://172.16.81.202:3000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),  // Use dynamic email
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Password reset successful:', data);
        navigation.navigate('login'); // Navigate to login on success
      } else {
        console.error('Password reset failed:', data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
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

      <Text style={styles.header}>Reset Your Password</Text>

      <Card style={styles.card}>
        <Card.Content>
          {/* Email Input Field with Error Message */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            error={!!emailError} // Show error if there's an email error
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* New Password Input Field */}
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          {/* Confirm Password Input Field */}
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            style={styles.button} 
            onPress={handleForgotPassword} // Call handleForgotPassword on button press
          >
            Reset Password
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default ForgotPassword;
