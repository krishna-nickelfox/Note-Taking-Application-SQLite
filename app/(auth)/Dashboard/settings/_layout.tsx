import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const SettingLayout = () => {
  return (
    <Stack
    screenOptions={{
      headerBackTitle:'Back',
    }}
    >
      
      <Stack.Screen name='index' options={{
        title:"settings",
        headerShown:false
      }} />

      
    </Stack>
  )
}

export default SettingLayout

const styles = StyleSheet.create({})