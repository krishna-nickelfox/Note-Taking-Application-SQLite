import LoaderButton from '@/components/LoaderButton'
import { getDB } from '@/config/db'
import { useAuthContext } from '@/context/AuthContext'
import { ChangePasswordUser, LoggedUser } from '@/types/auth'
import { logo_image } from '@/utils/constant'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Crypto from 'expo-crypto'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { ErrorMessage, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

const ChangePassword = () => {
   const [loading,setLoading] = useState(false)
const router = useRouter()
const {logoutHandler} = useAuthContext()
  const initialValues :ChangePasswordUser={
    new_password:'',
    old_password:'',
    confirm_password:''
  }


  const validationSchema = yup.object({
    old_password:yup.string().required("Old Password is required").min(6,"Password should be grater than 6 characters").trim(),
    new_password:yup.string().required("New Password is Required").min(6,"Password should be grater than 6 characters").trim(),
    confirm_password: yup.string().required("Confirm Password is Required")
    .min(6,"Password should be grater than 6 characters").trim().equals([yup.ref("new_password")],"Password and Confirm Password should be same")
  })
  const onSubmitHandler = async(values:ChangePasswordUser,helpers:FormikHelpers<ChangePasswordUser>)=>{

    try {
      setLoading(true)
      const db = await getDB()
      const userId= await SecureStore.getItemAsync("user")

      // extract user from db 
      const user:LoggedUser | any = await db.getFirstAsync(`
        select * from users where id = ?
        `,[userId])

        if(!user){
          throw new Error("User Not Found in DB")
        }

        // hashPassword
        const hashPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,values.old_password
        )

        //check exist passsword or user entered password 
        if(user?.password != hashPassword){
          throw new Error("Invalid Old password")
        }
        const new_hassed_pass =  await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,values.new_password
        )

     const result =   await db.runAsync(`
          update users set password = ? where id =?;
          
          `,[new_hassed_pass,userId])

          //console.log(result)

          Toast.show({
            type:"success",
            position:'bottom',
            text1:"Success",
            text2:"Password Change Successfully , Try with New Password"
          })
          await  logoutHandler()
          router.dismissTo("/")
    






      
      

    } catch (error:any) {
      Alert.alert("Error",error?.message)
    }finally{
      setLoading(false)
    }

  }
  

  return (
    <View>
          <View className='py-10  justify-center items-center'>
            <Image
            source={{
              uri:logo_image
            }}
            width={100}
            height={100}
            />
      <Text className='text-2xl font-bold text-start'>Change Password</Text>


            <Formik validationSchema={validationSchema} onSubmit={onSubmitHandler} initialValues={initialValues}>
               
               {({handleSubmit,values,setFieldValue})=>(
                 <View className='px-5 mt-4 items-start justify-start w-full'>

              <View className='mt-3 w-full'>
                <Text>Old Password <Text className='text-red-500'>*</Text> </Text>
              <PasswordTextInputs
                placeholderText='Enter Old Password'
                onPress={(s:string)=>setFieldValue('old_password',s)}
              />
              <ErrorMessage name='old_password' 
              render={(text)=><Text className='text-red-500'>{text}</Text>}
              />

              </View>

  <View className='mt-3 w-full'>
                <Text>New Password <Text className='text-red-500'>*</Text> </Text>
              <PasswordTextInputs
                placeholderText='Enter New Password'
                onPress={(s:string)=>setFieldValue('new_password',s)}
              />
              <ErrorMessage name='new_password' 
              render={(text)=><Text className='text-red-500'>{text}</Text>}
              />

              </View>

                <View className='mt-3 w-full'>
                <Text>Confirm Password <Text className='text-red-500'>*</Text> </Text>
              <PasswordTextInputs
                placeholderText='Enter Confirm Password'
                onPress={(s:string)=>setFieldValue('confirm_password',s)}
              />
              <ErrorMessage name='confirm_password' 
              render={(text)=><Text className='text-red-500'>{text}</Text>}
              />

              </View>

              <LoaderButton
              loading={loading}
              text='Change Password'
              onpress={handleSubmit}
              />


              </View>
               )}


            </Formik>


          </View>

    </View>
  )
}

export default ChangePassword

const styles = StyleSheet.create({})


interface PasswordTextInputsType{
placeholderText?:string 
onPress?:(s:string)=>void
value ?:string
}

export const PasswordTextInputs = (prop:PasswordTextInputsType)=>{

  const [isShow,setIsShow] = useState(false)

  return <>
  <View className='border w-full rounded-full overflow-hidden flex-row px-2 items-center' >
  <TextInput 
  value={prop.value}
  placeholder={prop.placeholderText}
  secureTextEntry={isShow}
  onChangeText={prop.onPress}
  className='py-4 px-3  flex-1 ' /> 

    <TouchableOpacity  onPress={()=>{
      setIsShow(!isShow)
    }} className=''>
       <AntDesign name={!isShow?'eye-invisible' :'eye'} className='' size={24} />
    </TouchableOpacity>
 
  </View>
  </>
}