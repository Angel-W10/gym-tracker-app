import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";

interface Set {
  reps: number;
  weight: number;
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface Workout {
  name: string;
  date: string;
  exercises: Exercise[];
}

export default function WorkoutHistoryScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Load saved workouts when the component mounts
    const loadWorkouts = async () => {
      try {
        const data = await AsyncStorage.getItem("workouts");
        if (data) {
          setWorkouts(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error loading workouts:", error);
      }
    };

    loadWorkouts();
  }, []);

  const handleDeleteWorkout = async (index: number) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);

    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      Alert.alert("Workout deleted!");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Error deleting workout");
    }
  };

  const handleDeleteExercise = async (
    workoutIndex: number,
    exerciseIndex: number
  ) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].exercises.splice(exerciseIndex, 1);

    // If no exercises left, delete the entire workout
    if (updatedWorkouts[workoutIndex].exercises.length === 0) {
      handleDeleteWorkout(workoutIndex);
      return;
    }

    setWorkouts(updatedWorkouts);
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      Alert.alert("Exercise deleted!");
    } catch (error) {
      console.error("Error deleting exercise:", error);
      Alert.alert("Error deleting exercise");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Workout History</Text>

        {workouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts saved yet.</Text>
        ) : (
          workouts.map((workout, workoutIndex) => (
            <View key={workoutIndex} style={styles.card}>
              <View style={styles.workoutHeader}>
                <View>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDate}>
                    {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteWorkout(workoutIndex)}
                  style={styles.iconButton}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>

              {workout.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseContainer}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleDeleteExercise(workoutIndex, exerciseIndex)
                      }
                      style={styles.iconButton}
                    >
                      <Text>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.setDetails}>
                      Set {setIndex + 1}: {set.reps} reps, {set.weight} kg
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  workoutName: {
    ...typography.h2,
  },
  workoutDate: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  exerciseContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseName: {
    ...typography.body,
    fontWeight: "600" as const,
  },
  setDetails: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  iconButton: {
    padding: spacing.sm,
  },
});
