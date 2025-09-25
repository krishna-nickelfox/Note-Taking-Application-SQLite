import { getDB } from "@/config/db";
import AuthContextProvider from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from 'react-native-toast-message';
import '../global.css';
export default function RootLayout() {

  useEffect(()=>{
    getDB()
  },[])

  return <>
  <AuthContextProvider >
    <Stack screenOptions={{
      headerShown:false
    }}>
      {/* <Stack.Screen name="(auth)/Register" options={{
        title:"Register Page"
      }} /> */}
      </Stack>
      </AuthContextProvider>
      <Toast/>
      <StatusBar style="dark" />
  </>;
}
