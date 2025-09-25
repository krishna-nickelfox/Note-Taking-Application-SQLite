import { getDB } from '@/config/db'
import { useAuthContext } from '@/context/AuthContext'
import { NotesInterface } from '@/types/notes'
import { Link, RelativePathString } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const TodoCard = ({data}:{data:NotesInterface}) => {

    const [loading,setLoading] = useState(false)
    const {fetchAllNotes} = useAuthContext()
 
    const deleteHandler = async()=>{
   try {
         setLoading(true)
const db=await getDB()

await db.runAsync(`
    delete from notes where id=?
    `,[data.id as any])


    await fetchAllNotes()
   } catch (error:any) {
    Alert.alert("Error",error.message)
   }

    }



    return (
    <View className='px-3 mt-4 border border-gray-400 rounded py-5 w-[90%] mx-auto '>
      <Text className='text-3xl font-bold'>{data.title}</Text>
      <Text className='text-xl font-medium text-gray-800'>{data.description}</Text>
   <View className='flex-row gap-x-2 justify-end'>
       <Link href={'/Dashboard/notes/update/'+data.id as RelativePathString} className='text-whtie bg-yellow-500 px-3 py-2 rounded '>
        <Text className='text-white'>Update</Text>
      </Link>
       <TouchableOpacity  disabled={loading} onPress={deleteHandler} className='text-whtie bg-red-500 px-3 py-2 rounded '>
        <Text className='text-white'>{loading?"loading...":"Delete"}</Text>
      </TouchableOpacity>
   </View>
    </View>
  )
}

export default TodoCard

const styles = StyleSheet.create({})