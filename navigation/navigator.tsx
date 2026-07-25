import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  Theme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { navigationRef } from "./navigationService";
import { SideMenuProvider, useSideMenu } from "../components/SideMenu";
import DashboardScreen from "../screens/DashboardScreen";
import AuthScreen from "../screens/AuthScreen";
import SplashScreen from "../screens/SplashScreen";

const COLORS = {
  background: "#000000",
  card: "#000000",
  foreground: "#F1B836",
  text: "#FFFFFF",
  subtleText: "#8A8A8A",
  border: "#1F1F1F",
};

const AppTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    primary: COLORS.foreground,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.foreground,
  },
};

function MenuButton() {
  const { openMenu } = useSideMenu();
  return (
    <TouchableOpacity
      onPress={openMenu}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.headerButton}
    >
      <Ionicons name="menu" size={26} color={COLORS.foreground} />
    </TouchableOpacity>
  );
}

function ProfileButton() {
  return (
    <TouchableOpacity
      onPress={() => console.log("Navigate to Profile")}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.headerButton}
    >
      <Ionicons
        name="person-circle-outline"
        size={26}
        color={COLORS.foreground}
      />
    </TouchableOpacity>
  );
}

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.foreground,
        headerLeft: () => <MenuButton />,
        headerRight: () => <ProfileButton />,
        tabBarStyle: {
          height: 70,
          paddingTop: 13,
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarActiveTintColor: COLORS.foreground,
        tabBarInactiveTintColor: COLORS.subtleText,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type RootStackParamList = {
  Dashboard: undefined;
  Auth: undefined;
  Splash: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SideMenuProvider>
      <NavigationContainer ref={navigationRef} theme={AppTheme}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTintColor: COLORS.foreground,
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={BottomTabs}
            options={{ title: "Dashboard", headerShown: false }}
          />

          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SideMenuProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 110,
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.foreground,
  },
  headerButton: {
    paddingHorizontal: 12,
  },
});
