// navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import ProgressScreen from "../screens/ProgressScreen";
import WorkoutHistoryScreen from "../screens/WorkoutHistoryScreen";

export type RootStackParamList = {
  Home: undefined;
  AddWorkout: undefined;
  Progress: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="History" component={WorkoutHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
