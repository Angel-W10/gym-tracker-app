import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors, spacing, typography } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🏋️ Gym Tracker</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.card, styles.primaryCard]}
            onPress={() => navigation.navigate("AddWorkout")}
          >
            <Text style={styles.cardTitle}>Add Workout</Text>
            <Text style={styles.cardDescription}>
              Record your training session
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Progress")}
          >
            <Text style={styles.cardTitle}>Progress</Text>
            <Text style={styles.cardDescription}>
              View your fitness progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardDescription}>Browse past workouts</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: spacing.md,
  },
  header: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl * 2,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  menuContainer: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  cardDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
