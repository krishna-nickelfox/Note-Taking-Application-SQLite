import { useAuthContext } from '@/context/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, RelativePathString } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ListItemProps{
   name: string;
    Icon: React.JSX.Element;
    link: string;
    color: string;
}

const SettingsPage = () => {
  const {logoutHandler} =  useAuthContext()

  const listData:ListItemProps[] = [
    {
      "name":"Profile",
      "Icon":<Feather name="user" size={24} color="white" />,
      "link":"/Dashboard/settings/profile",
      "color":"bg-blue-500"
    },
   
    {
      "name":"Change Password",
      "Icon":<Ionicons name="key-outline" size={24} color="white" />,
      "link":"/Dashboard/settings/changePassword",
      color:"bg-red-500"
    },
    {
      "name":"Picture",
      "Icon":<EvilIcons name="image" size={24} color="white" />,
      "link":"/Dashboard/settings/avatar",
      color:"bg-yellow-500 "
    }
  ]

  return (
   <SafeAreaView className="flex-1 px-3 pt-10">
  <View className="flex-row items-center border rounded-lg px-2 h-12 border-gray-600">
    <TextInput
      className="flex-1 py-2"
      placeholder="Search..."
      placeholderTextColor={'gray'}
    />
    <EvilIcons size={34} name="search" />
  </View>

 
 <FlatList
 data={listData}
 ListFooterComponent={()=>{
  return <>
   <Pressable
   onPress={logoutHandler}
    
      className="w-full py-3 px-3 border-b border-gray-300"
    >
      <View className="flex-row items-center gap-x-4">
        <View className={`p-2 rounded-full bg-green-500`}>
          <AntDesign name="logout" size={24} color="white" />
        </View>
        <Text className="text-lg font-semibold">Logout</Text>
      </View>
    </Pressable>
  </>
 }}
 className='mt-5'
 renderItem={({index,item})=><ListItem key={index} data={item}

 
 
 
 />}
  

 


 />


</SafeAreaView>
  )
}

export default SettingsPage






const ListItem = ({ data }: { data: ListItemProps }) => {
  return (
    <Link
      href={data.link as RelativePathString}
      className="w-full py-3 px-3 border-b border-gray-300"
    >
      <View className="flex-row items-center gap-x-4">
        <View className={`p-2 rounded-full ${data.color}`}>
          {data.Icon}
        </View>
        <Text className="text-lg font-semibold">{data.name}</Text>
      </View>
    </Link>
  )
}