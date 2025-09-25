import TodoCard from '@/components/TodoCard'
import { useAuthContext } from '@/context/AuthContext'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {

  const {user,notes} = useAuthContext()


  return (
    <SafeAreaView className='flex-1 px-3 pt-10'>
      

      <FlatList
      ListHeaderComponent={()=><Text className='text-3xl font-bold'> Hi, {user && user.name} 👋 </Text>}
        data={notes}
        showsVerticalScrollIndicator={false}
        style={{flex:1}}
        ListEmptyComponent={() => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-2xl font-bold text-gray-500">No notes found </Text>
    </View>
  )}
        renderItem={({item,index})=><TodoCard data={item} key={index} />}
      />
   
   
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({})

