import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";

export default function AddWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: [{ reps: "", weight: "" }] },
  ]);

  const handleExerciseChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const addNewSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: "", weight: "" });
    setExercises(newExercises);
  };

  const addNewExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: [{ reps: "", weight: "" }] },
    ]);
  };

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter(
      (_, i) => i !== setIndex
    );
    setExercises(newExercises);
  };

  const deleteExercise = (exerciseIndex: number) => {
    const newExercises = exercises.filter((_, i) => i !== exerciseIndex);
    setExercises(newExercises);
  };

  const handleSave = async () => {
    if (
      !workoutName ||
      exercises.some(
        (ex) => !ex.name || ex.sets.some((s) => !s.reps || !s.weight)
      )
    ) {
      Alert.alert("Please fill out all fields");
      return;
    }

    const workout = {
      name: workoutName,
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets.map((s) => ({
          reps: parseInt(s.reps),
          weight: parseFloat(s.weight),
        })),
      })),
      date: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem("workouts");
      const workouts = existingData ? JSON.parse(existingData) : [];
      workouts.push(workout);
      await AsyncStorage.setItem("workouts", JSON.stringify(workouts));

      // Clear the form
      setWorkoutName("");
      setExercises([{ name: "", sets: [{ reps: "", weight: "" }] }]);
      Alert.alert("Workout saved!");
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error saving workout");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Add Workout</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g. Full Body Workout"
            placeholderTextColor={colors.text.secondary}
          />
        </View>

        {exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} style={styles.card}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>
                Exercise {exerciseIndex + 1}
              </Text>
              <TouchableOpacity
                onPress={() => deleteExercise(exerciseIndex)}
                style={styles.iconButton}
              >
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={exercise.name}
              onChangeText={(value) =>
                handleExerciseChange(exerciseIndex, value)
              }
              placeholder="e.g. Bench Press"
              placeholderTextColor={colors.text.secondary}
            />

            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setContainer}>
                <View style={styles.setInputContainer}>
                  <TextInput
                    style={[styles.input, styles.setInput]}
                    value={set.reps}
                    onChangeText={(value) =>
                      handleSetChange(exerciseIndex, setIndex, "reps", value)
                    }
                    placeholder="Reps"
                    placeholderTextColor={colors.text.secondary}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.setInput]}
                    value={set.weight}
                    onChangeText={(value) =>
                      handleSetChange(exerciseIndex, setIndex, "weight", value)
                    }
                    placeholder="Weight (kg)"
                    placeholderTextColor={colors.text.secondary}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => deleteSet(exerciseIndex, setIndex)}
                    style={styles.iconButton}
                  >
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addNewSet(exerciseIndex)}
            >
              <Text style={styles.addButtonText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addButton, styles.addExerciseButton]}
          onPress={addNewExercise}
        >
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  exerciseTitle: {
    ...typography.h2,
  },
  setContainer: {
    marginTop: spacing.sm,
  },
  setInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  setInput: {
    flex: 1,
  },
  iconButton: {
    padding: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addExerciseButton: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 16,
  },
});
