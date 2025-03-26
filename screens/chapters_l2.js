import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const L2_ChapterScreen = ({ navigation }) => {
  const chapters = [
    'Talking About Morning Routines',
    'Describing Work or School',
    'Evening and Night Activities',
    'Talking About Weekends',
    'Putting It All Together'
  ];
  const chapterImages = {
    1: require('../assets/chapter1.png'),
    2: require('../assets/chapter2.png'),
    3: require('../assets/chapter3.png'),
    4: require('../assets/chapter4.png'),
    5: require('../assets/chapter5.png'),
  };

  return (
    <View style={styles.container}>
      {/* Header Message */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.header}>
        <MaterialCommunityIcons name="book" size={30} color="cyan" />
        <Text style={styles.headerText}>Choose a Chapter</Text>
      </View>

      {/* Scrollable Chapter List */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {chapters.map((chapter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chapterCard}
            onPress={() => navigation.navigate(`l2_chapter${index + 1}`)}
          >
            <Image source={chapterImages[index + 1]} style={styles.lessonImage} />
            <Text style={styles.chapterTitle}>Chapter {index + 1}: {chapter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  lessonImage: {
    marginRight: 10,
    width: 60,
    height: 60,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'cyan',
  },
  scrollContainer: {
    width: '100%',
    paddingBottom: 20, 
  },
  chapterCard: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'cyan',
  },
  chapterTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default L2_ChapterScreen;
