import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Import only Firebase Auth
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle password reset functionality
  const handleForgotPassword = async () => {
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email); // Send password reset email
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      setEmailError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
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
          {/* Email Input Field */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            error={!!emailError}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <Button
            mode="contained"
            style={styles.button}
            onPress={handleForgotPassword}
            loading={loading}
          >
            Reset Password
          </Button>
        </Card.Content>
      </Card>
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
  successText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default ForgotPassword;
