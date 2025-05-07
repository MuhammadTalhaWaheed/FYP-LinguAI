import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const TrackYourProgress = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user?.uid) return;

      try {
        const db = getFirestore();
        const progressCollection = collection(db, `users/${user.uid}/progress`);
        const snapshot = await getDocs(progressCollection);

        const progressArray = snapshot.docs.map(doc => doc.data());

        // Group by lesson and keep the max score
        const maxScoreProgress = progressArray.reduce((acc, progress) => {
          const existing = acc.find(p => p.lesson === progress.lesson);
          if (!existing || progress.score > existing.score) {
            return [...acc.filter(p => p.lesson !== progress.lesson), progress];
          }
          return acc;
        }, []);

        // Sort by date (most recent first)
        maxScoreProgress.sort((a, b) => new Date(b.date) - new Date(a.date));

        setProgress(maxScoreProgress);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Track Your Progress</Text>

      {progress.length === 0 ? (
        <Text style={styles.noprogressText}>No progress to display.</Text>
      ) : (
        <FlatList
          data={progress}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.progressItem}>
              {item.badgeUrl ? (
                <Image source={{ uri: item.badgeUrl }} style={styles.badgeImage} />
              ) : (
                <Image source={require('../assets/logo.png')} style={styles.badgeImage} />
              )}
              <Text style={styles.progressTitle}>{item.lesson}</Text>
              <Text style={styles.progressTitle}>Score: {item.score}</Text>
              <Text style={styles.progressDescription}>{item.feedback}</Text>
              <Text style={styles.progressDescription}>Date: {new Date(item.date).toLocaleDateString()}</Text>
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
  noprogressText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  progressItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  progressTitle: {
    fontSize: 18,
    color: 'white',
  },
  progressDescription: {
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

export default TrackYourProgress;
