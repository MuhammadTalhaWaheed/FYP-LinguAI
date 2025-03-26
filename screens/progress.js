import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

function QuizResults() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firestore collection
    const subscriber = firestore()
      .collection('quiz_answers')  // Firestore collection name
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizData(data);
        setLoading(false);
      });

    return () => subscriber(); // Unsubscribe on unmount
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 20 }}>
      {quizData.map((item) => (
        <Text key={item.id} style={{ fontSize: 16, marginBottom: 10 }}>
          {item.transcription} - Accuracy: {item.accuracy}%
        </Text>
      ))}
    </View>
  );
}

export default QuizResults;
