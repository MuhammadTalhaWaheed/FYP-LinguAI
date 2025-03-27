let score = 0;
  
    if (selectedAnswer === "greeting") score += 1;
    if (fillBlankAnswer.trim().toLowerCase() === "like") score += 1;
    if (multipleChoiceAnswer === "A") score += 1;
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert("Error", "You must be logged in to save your score.");
      return;
    }
  
    const db = getDatabase();
    const userScoreRef = ref(db, `users/${user.uid}/user_lesson_1_score`);
    const achievementsRef = ref(db, `users/${user.uid}/achievements`);
    const progressRef = ref(db, `users/${user.uid}/progress`);
  
    try {
      // Save the score to the database
      await set(userScoreRef, score);
  
      // Provide feedback based on the score
      let feedback = '';
      if (score === 3) {
        feedback = 'Excellent work! You aced Lesson 1.';
      } else if (score === 2) {
        feedback = 'Good job! You passed Lesson 1, but there’s room for improvement.';
      } else {
        feedback = 'Keep trying! Review Lesson 1 and try again.';
      }
  
      // Append progress to the database
      const progress = {
        lesson: 'Lesson 1',
        score: score,
        feedback: feedback,
        date: new Date().toISOString(),
        badgeUrl: '../assets/logo.png',
      };
      const newProgressRef = ref(db, `users/${user.uid}/progress`);
      await push(newProgressRef, progress);
  
      // Append achievement if the user passes the lesson
      if (score > 1) {
        const newAchievement = {
          title: "Lesson 1 Passed",
          description: "You successfully passed Lesson 1!",
          date: new Date().toISOString(),
          badgeUrl: '../assets/logo.png',
        };
        const newAchievementRef = ref(db, `users/${user.uid}/achievements`);
        await push(newAchievementRef, newAchievement);
      }
  
      Alert.alert("Assessment Submitted", `Your score is: ${score}/3 and saved successfully.`);
    } catch (error) {
      console.error("Error saving score and feedback:", error);
      Alert.alert("Error", "Failed to save your score. Please try again.");
    }
  };
