
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from './AuthContext';

const AchievementsAndAwards = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const db = getDatabase();
        const achievementsRef = ref(db, `users/${user.uid}/achievements`);
        const snapshot = await get(achievementsRef);
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const achievementsArray = Object.values(data); // Convert object to array
          // Filter out duplicate lessons by title
          const uniqueAchievements = achievementsArray.reduce((acc, achievement) => {
            if (!acc.some(item => item.title === achievement.title)) {
              acc.push(achievement);
            }
            return acc;
          }, []);

          // Sort achievements by date (most recent first)
          uniqueAchievements.sort((a, b) => new Date(b.date) - new Date(a.date));

          setAchievements(uniqueAchievements);

        } else {
          console.log('No achievements found!');
          setAchievements([]);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.uid) {
      fetchAchievements();
    }
  }, [user]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Achievements and Awards</Text>

      {achievements.length === 0 ? (
        <Text style={styles.noAchievementsText}>No achievements to display.</Text>
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({ item }) => (
            <View style={styles.achievementItem}>
              {item.badgeUrl ? (
                <Image source={{ uri: item.badgeUrl }} style={styles.badgeImage} />
              ) : (
                <Image source={require('../assets/logo.png')} style={styles.badgeImage} />
              )}
              <Text style={styles.achievementTitle}>{item.title}</Text>
              <Text style={styles.achievementDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    alignItems: 'center',
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
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  achievementItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  achievementTitle: {
    fontSize: 18,
    color: 'white',
  },
  noAchievementsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 5,
  },
  badgeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
});

export default AchievementsAndAwards;
