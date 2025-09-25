import { useAuthContext } from '@/context/AuthContext'
import moment from 'moment'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const ProfilePage = () => {

  const {user} = useAuthContext()

  return (
    <SafeAreaView className='w-full flex-1'>

            <ScrollView className='' >

      <View className='justify-center items-center '>
           <Image source={{uri:user?.image??"https://styleguide.expo.dev/_next/image?url=%2Ficon.png&w=96&q=75"}}   width={100} height={100} />
      </View>
      <View className='mt-10'>
        <Text className='text-center text-2xl font-bold'>{user?.name}</Text>
      </View>


       <View className=''>
        <Text className='text-center text-2xl font-bold'>{user?.email}</Text>
      </View>


       <View className='mt-2'>
        <Text className='text-center text-2xl font-bold'>{moment(user?.created_at).format("lll")}</Text>
      </View>


            </ScrollView>

    </SafeAreaView>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})