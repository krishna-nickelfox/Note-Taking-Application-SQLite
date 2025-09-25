import LoaderButton from "@/components/LoaderButton";
import { getDB } from "@/config/db";
 
import { RegisterUser } from "@/types/auth";
import { logo_image } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Crypto from "expo-crypto";


import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ErrorMessage, Formik, FormikHelpers } from 'formik';
import { useState } from "react";
import { Alert, Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as yup from 'yup';

export default function Register() {
const [isVisible,setIsVisible] = useState(false)
const [loading,setLoading] = useState(false)
const router = useRouter()

  const initialValues:RegisterUser = {
    name:"",
    email:"",
    password:""
  }
  const validationSchema = yup.object({
    name:yup.string().required("Name is Required").trim(),
    email:yup.string().email("Email must be valid").required("Email is Required").trim(),
    password:yup.string().required("Password is Required").min(6,"Password should be grater than 6 characters").trim()
  })

  const onSubmitHandler =async(values:RegisterUser,helpers:FormikHelpers<RegisterUser>)=>{
    try {
      setLoading(true)
      
      
      const db = await getDB()
      
      //check user already exist or not 
      const check_exists = await db.getFirstAsync(`
        select * from users where email=?
        `,[values.email.toLowerCase()])

        if(check_exists){
          throw new Error("User Already Exists")
        }

       const hash_password= await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    values.password
  );

       const result= await db.runAsync(`
          insert into users(name,email,password)
          values(?,?,?)
          `,[values.name,values.email.toLowerCase(),hash_password])

         await SecureStore.setItemAsync('user',result.lastInsertRowId.toString())

          router.dismissTo('/(auth)/Dashboard')

          





      helpers.resetForm()

    } catch (error:any) {
        Alert.alert("Error",error?.message)
      Toast.show({
        type:"error",
        text1:"Error",
        text2:error?.message || "something wrong" 
      })
    }finally{
      setLoading(false)
    }
  }


  return (
   <SafeAreaView className="flex-1 justify-center items-center">
        <Formik  onSubmit={onSubmitHandler} initialValues={initialValues}  validationSchema={validationSchema}>

    {({handleSubmit,setFieldValue,values})=>(
      <View className="w-[90%]" >
           <View className=' items-center justify-center'>
          <Image source={{
              uri: logo_image
          }}
          className='w-24 h-24 '
          />
          </View>

          <View className="mt-3"> 
            <Text>Name</Text>
            <TextInput keyboardType="default" value={values.name} onChangeText={(text)=>setFieldValue('name',text)} className="w-full py-3 border  rounded-full border-gray-400 px-3 " placeholder="Enter Your Name" />
            <ErrorMessage name="name" render={(text)=><Text className="text-red-500 ">{text}</Text>} />
          </View>

            <View className="mt-3"> 
            <Text>Email</Text>
            <TextInput keyboardType="email-address" value={values.email} onChangeText={(text)=>setFieldValue('email',text)} className="w-full py-3 border  rounded-full border-gray-400 px-3 " placeholder="Enter Your Email" />
            <ErrorMessage name="email" render={(text)=><Text className="text-red-500 ">{text}</Text>} />
          </View>



          <View className="mt-3"> 
            <Text>Password</Text>
            
            <View className="py-2 border  rounded-full border-gray-400  flex-row  pr-10">
              <TextInput 
            secureTextEntry={!isVisible}
            keyboardType="visible-password" value={values.password} onChangeText={(text)=>setFieldValue('password',text)} className="w-full px-3 " placeholder="Enter Your Password" />
<AntDesign onPress={()=>setIsVisible(!isVisible)} name={ isVisible?"eye-invisible" : "eye" }size={24} color="black" />

            </View>

            <ErrorMessage name="password" render={(text)=><Text className="text-red-500 ">{text}</Text>} />
          </View>

        <LoaderButton  onpress={handleSubmit} text="Register" loading={loading} />

<View className="flex flex-row items-center my-4">
  <View className="flex-1 h-[1px] bg-gray-600" />
  <Text className="px-2 text-gray-500">OR</Text>
  <View className="flex-1 h-[1px] bg-gray-600" />
</View>

<Link href={'/(auth)/LoginScreen'} className="text-center text-blue-500 text-2xl">
Sign In
</Link>



        </View> 

    )}

        </Formik>
   </SafeAreaView>
  );
}
