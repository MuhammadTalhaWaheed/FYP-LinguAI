// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
// import { UserContext } from '../context/UserContext'; // Import UserContext
// import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

// const TrackYourProgress = () => {
//   const { user } = useContext(UserContext); // Access user data from context
//   const [progressData, setProgressData] = useState([]); // State for progress data
//   const [loading, setLoading] = useState(true); // State for loading indicator

//   useEffect(() => {
//     const fetchProgressData = async () => {
//       setLoading(true);
//       try {
//         const db = getFirestore();
//         const userDocRef = doc(db, 'users', user.uid);
//         const userSnapshot = await getDoc(userDocRef);

//         if (userSnapshot.exists()) {
//           const data = userSnapshot.data();
//           console.log('Fetched progress data:', data.progress); // Debugging: Log progress data
//           setProgressData(data.progress || []); // Update progress state
//         } else {
//           console.log('No such document!');
//           setProgressData([]); // Set to empty array if no document exists
//         }
//       } catch (error) {
//         console.error('Error fetching progress data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.uid) {
//       fetchProgressData();
//     }
//   }, [user]);

//   if (loading) {
//     return <Text style={styles.loadingText}>Loading...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Image source={require('../assets/logo.png')} style={styles.logo} />
//       <Text style={styles.header}>Track Your Progress</Text>

//       {progressData.length === 0 ? (
//         <Text style={styles.noProgressText}>No progress to display.</Text>
//       ) : (
//         <FlatList
//           data={progressData}
//           keyExtractor={(item, index) => index.toString()} // Use index as key
//           renderItem={({ item }) => (
//             <View style={styles.progressItem}>
//               <Text style={styles.progressTitle}>{item.lesson}</Text>
//               <Text style={styles.progressDetails}>Score: {item.score}</Text>
//               <Text style={styles.progressDetails}>Feedback: {item.feedback}</Text>
//               <Text style={styles.progressDetails}>Date: {new Date(item.date).toLocaleDateString()}</Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'black',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   header: {
//     fontSize: 22,
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loadingText: {
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   noProgressText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   progressItem: {
//     backgroundColor: '#1e1e1e',
//     padding: 15,
//     marginVertical: 5,
//     borderRadius: 5,
//     width: '100%',
//   },
//   progressTitle: {
//     fontSize: 18,
//     color: 'white',
//   },
//   progressDetails: {
//     fontSize: 14,
//     color: '#cccccc', // Light gray for details
//     marginTop: 5,
//   },
// });

// export default TrackYourProgress;





import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from './AuthContext';

const TrackYourProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        const db = getDatabase();
        const progressRef = ref(db, `users/${user.uid}/progress`);
        const snapshot = await get(progressRef);
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const progressArray = Object.values(data); // Convert object to array
  
          // Group progress by lesson and keep the maximum score for each lesson
          const maxScoreProgress = progressArray.reduce((acc, progress) => {
            const existingLesson = acc.find(item => item.lesson === progress.lesson);
            if (!existingLesson || progress.score > existingLesson.score) {
              acc = acc.filter(item => item.lesson !== progress.lesson); // Remove duplicate lesson
              acc.push(progress); // Add the lesson with the maximum score
            }
            return acc;
          }, []);

          // Sort progress by date (most recent first)
          maxScoreProgress.sort((a, b) => new Date(b.date) - new Date(a.date));
  
          setProgress(maxScoreProgress);
        } else {
          console.log('No progress found!');
          setProgress([]);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.uid) {
      fetchProgressData();
    }
  }, [user]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

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
  noprogressText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
