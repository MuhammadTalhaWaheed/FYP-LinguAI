import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons
import { useAuth } from '../screens/AuthContext'; // Import Auth Context

const PersonalInfo = ({ navigation }) => {
  const { user } = useAuth(); // Get user data from context

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.header}>Personal Information</Text>

      {/* User Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={24} color="white" />
            <Text style={styles.infoText}>{user.displayName}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={24} color="white" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Buttons */}
      {/* <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="pencil" size={24} color="white" />}
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}
      >
        EDIT PROFILE
      </Button> */}

      <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="home" size={24} color="white" />}
        style={styles.button}
        onPress={() => navigation.navigate('home')}
      >
        BACK TO HOME
      </Button>
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 22,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
  button: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#0056d2',
    borderRadius: 10,
  },
});

export default PersonalInfo;
