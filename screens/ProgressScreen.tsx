import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
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

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    strokeWidth?: number;
  }>;
}

export default function ProgressScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ["Start"],
    datasets: [{ data: [0], strokeWidth: 2 }],
  });

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await AsyncStorage.getItem("workouts");
        if (data) {
          const parsedWorkouts: Workout[] = JSON.parse(data);
          setWorkouts(parsedWorkouts);

          if (parsedWorkouts.length > 0) {
            // Process data to calculate total weight lifted per workout
            const labels = parsedWorkouts.map((workout: Workout) =>
              new Date(workout.date).toLocaleDateString()
            );
            const dataPoints = parsedWorkouts.map((workout: Workout) =>
              Math.max(
                0,
                workout.exercises.reduce(
                  (total: number, exercise: Exercise) => {
                    return (
                      total +
                      exercise.sets.reduce((setTotal: number, set: Set) => {
                        return setTotal + (set.reps || 0) * (set.weight || 0);
                      }, 0)
                    );
                  },
                  0
                )
              )
            );

            // Ensure we have valid data points
            if (
              dataPoints.length > 0 &&
              dataPoints.some((point) => point > 0)
            ) {
              setChartData({
                labels,
                datasets: [{ data: dataPoints, strokeWidth: 2 }],
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading workouts:", error);
      }
    };

    loadWorkouts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Progress Overview</Text>

        {workouts.length > 0 ? (
          <>
            <View style={styles.card}>
              <LineChart
                data={chartData}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(218, 255, 62, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
              />
              <Text style={styles.description}>
                Total weight lifted per workout over time
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Complete your first workout to see your progress!
            </Text>
          </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chart: {
    marginVertical: spacing.md,
    borderRadius: 16,
  },
  description: {
    ...typography.caption,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
