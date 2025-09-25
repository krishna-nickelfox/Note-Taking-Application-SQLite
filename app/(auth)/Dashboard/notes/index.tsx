import LoaderButton from '@/components/LoaderButton'
import { getDB } from '@/config/db'
import { NotesInterface } from '@/types/notes'
import * as SecureStore from 'expo-secure-store'
import { Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import * as yup from 'yup'
const NotesAdd = () => { 
  const [loading,setLoading] = useState(false)
 
  const initialValues : NotesInterface={
    title:'',
    description:''
    }
    const ValidationSchama = yup.object({
      title:yup.string().required("Title is Required"),
      description:yup.string().required("Description is required")
    })

    const onSubmitHandler = async(values:NotesInterface,helpers:FormikHelpers<NotesInterface>)=>{
        try {
          setLoading(true)

          const db =await getDB()
const user =await SecureStore.getItemAsync("user")
         const result = await db.runAsync(`
            insert into notes(title,description,user_id)
            values(?,?,?)
            `,[values.title,values.description,user])

            //console.log(result)
          Toast.show({
            type:'success',
            text1:"Success",
            text2:"Note Added !"
          })
            helpers.resetForm()

        } catch (error:any) {
          Alert.alert("Errpr",error.message)
          
        }finally{
          setLoading(false)
        }
    }

  return (
    <SafeAreaView className='px-3'>
      
      <Formik onSubmit={onSubmitHandler} validationSchema={ValidationSchama} initialValues={initialValues}>
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





              <LoaderButton onpress={handleSubmit} text='Submit' loading={loading} />





            </View>
        )}
      </Formik>


    </SafeAreaView>
  )
}

export default NotesAdd

const styles = StyleSheet.create({})