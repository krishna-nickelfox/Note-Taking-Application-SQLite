import LoaderButton from '@/components/LoaderButton'
import { getDB } from '@/config/db'
import { NotesInterface } from '@/types/notes'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import * as yup from 'yup'
const UpdateById = () => { 
  const [loading,setLoading] = useState(false)
  const [fetching,setFetching] = useState(true)


const [initialValues,setInitialValues] = useState<NotesInterface >({
    title:'',
    description:''
})
const {id}= useLocalSearchParams()
const router = useRouter()


const fetchNote = async()=>{

        try {
            setFetching(true)
    const db =await getDB()
  const notes:NotesInterface|any=   await db.getFirstAsync(`
        select * from notes where id = ?
        `,[id as any])
        setInitialValues({
            ...notes,
            // isComplete:notes.isComplete==0?false:true
        })
      
        } catch (error:any) {
            Alert.alert("Error",error.message)
            router.back()
        }finally{
  setFetching(false)
        }
}

useEffect(()=>{
    fetchNote()
},[])

 
//   const initialValues : NotesInterface={
//     title:'',
//     description:''
//     }
    const ValidationSchama = yup.object({
      title:yup.string().required("Title is Required"),
      description:yup.string().required("Description is required")
    })

    const onSubmitHandler = async(values:NotesInterface,helpers:FormikHelpers<NotesInterface>)=>{
        try {
          setLoading(true)

          const db =await getDB() 
         const result = await db.runAsync(`
            update notes set title = ?,description=?  where id = ?
            `,[values.title,values.description,id as any])

            //console.log(result)
          Toast.show({
            type:'success',
            text1:"Success",
            text2:"Note Updated !"
          })
            // helpers.resetForm()
            router.push('/(auth)/Dashboard')

        } catch (error:any) {
          Alert.alert("Errpr",error.message)
          
        }finally{
          setLoading(false)
        }
    }

    if(fetching){
        return <SafeAreaView className='flex-1 justify-center items-center'>
            <ActivityIndicator size={'large'} color={'black'} />
            <Text>loading...</Text>
        </SafeAreaView>
    }


  return (
    <SafeAreaView className='px-3'> 
   <View className='px-2 py-3'>
     <EvilIcons  onPress={()=>router.replace("/(auth)/Dashboard")} name='arrow-left' size={45} />
   </View>
      <Formik 
       
      onSubmit={onSubmitHandler} validationSchema={ValidationSchama} initialValues={initialValues}>
        {({handleSubmit,values,setFieldValue})=>(
            <View className='w-[90%] my-10 mx-auto' >

              <View>
                <Text>Title</Text>
                <TextInput 
                
                value={values.title}
                onChangeText={(text)=>setFieldValue('title',text)}
                className='w-full py-3 border rounded-xl px-2' placeholder='Enter Note Title' />
              </View>

                 <View className='mt-4'>
                <Text>Description</Text>
                <TextInput 
                
                value={values.description}
                onChangeText={(text)=>setFieldValue('description',text)}
                multiline
                numberOfLines={3}
                className='w-full mt-2 py-3 border rounded-xl h-44 px-2' placeholder='Enter Note Description' />
              </View>


                 {/* <View className='mt-4'>
                <Text>Status</Text>
                        <Switch 
                        value={values.isComplete}
                        onValueChange={(vak)=>{
                            setFieldValue('isComplete',vak)
                        }}
                        />


              </View> */}





              <LoaderButton onpress={handleSubmit} text='Submit' loading={loading} />





            </View>
        )}
      </Formik>


    </SafeAreaView>
  )
}

export default UpdateById

const styles = StyleSheet.create({})