import { logo_image } from '@/utils/constant'
import { RelativePathString, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const Index = () => {
const router = useRouter();

const checkUser = async () => {
  const user = await SecureStore.getItemAsync("user");
  if (!user) {
    return "/(auth)/LoginScreen";
  } else {
    return "/(auth)/Dashboard";
  }
};

useEffect(() => {
  const p1 = setTimeout(async () => {
    const path = await checkUser();
    //console.log(path)
    router.dismissTo(path as RelativePathString); // ✅ directly string path
  }, 2000);

  return () => {
    clearTimeout(p1);
  };
}, []);

  return (
    <SafeAreaView className='flex-1' >
   <View className='flex-1 h-44 items-center justify-center'>
<Image source={{
    uri: logo_image
}}
className='w-44 h-44'
/>
        <View className='mt-3'>
<ActivityIndicator size={'large' } style={{}} color={'black'} />

        </View>
   </View>
   <View className='absolute bottom-10 w-full '>

   <Text className='  text-center '>please wait....</Text>
   </View>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({})