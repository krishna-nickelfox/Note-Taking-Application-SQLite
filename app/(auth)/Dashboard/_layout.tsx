import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 65,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              color={!focused ? "black" : "blue"}
              size={24}
            />
          ),
        }}
      />

      {/* Center Floating Button */}
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: () => (
            <View style={styles.plusWrapper}>
              <Ionicons name="add" size={30} color="white" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused }) => (
            <EvilIcons
              name="gear"
              color={!focused ? "black" : "blue"}
              size={30}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;

const styles = StyleSheet.create({
  plusWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6", // blue
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25, // lift above tab bar
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6, // Android shadow
  },
});
