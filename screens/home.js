import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';  
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.mainMessage}>
        Navigate the App{'\n'}From here!
      </Text>

      <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="book" size={24} color="green" />}
        style={styles.button}
        onPress={() => navigation.navigate('lessons')}
      >
        LESSONS
      </Button>

      <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="account" size={24} color="brown" />}
        style={styles.button}
        onPress={() => navigation.navigate('PersonalInfo')}
      >
        PERSONAL INFORMATION
      </Button>

      <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="chart-line" size={24} color="red" />}
        style={styles.button}
        onPress={() => navigation.navigate('TrackYourProgress')}
      >
        TRACK YOUR PROGRESS
      </Button>

      <Button
        mode="contained"
        icon={() => <MaterialCommunityIcons name="trophy" size={24} color="yellow" />}
        style={styles.button}
        onPress={() => navigation.navigate('AchievementsAndAwards')}
      >
        ACHIEVEMENTS AND AWARDS
      </Button>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  logo: {
    width: 300,
    height: 250,
    marginBottom: 10,
    marginTop: 50,
  },
  mainMessage: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    marginVertical: 20,
    backgroundColor: '#0056d2',
    borderRadius: 10,
  },
});

export default HomeScreen;
