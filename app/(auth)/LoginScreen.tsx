import LoaderButton from "@/components/LoaderButton";
import { getDB } from "@/config/db";
import { LoginUser } from "@/types/auth";
import { logo_image } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Crypto from 'expo-crypto';
import { Link, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { ErrorMessage, Formik, FormikHelpers } from 'formik';
import { useState } from "react";
import { Alert, Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from 'yup';

export default function LoginScreen() {
const [isVisible,setIsVisible] = useState(false)
const [loading,setLoading] = useState(false)
const router = useRouter()
  const initialValues:LoginUser = {
    email:"",
    password:""
  }
  const validationSchema = yup.object({
    email:yup.string().email("Email must be valid").required("Email is Required"),
    password:yup.string().required("Password is Required").min(6,"Password should be grater than 6 characters")
  })

  const onSubmitHandler =async(values:LoginUser,helpers:FormikHelpers<LoginUser>)=>{
    try {
      setLoading(true)
      
      const db= await getDB()
        const result:any = await db.getFirstAsync( `
          select * from users where email = ?
          
          `,[values.email.toLowerCase()])

          //console.log(result)

          if(!result){
            throw new Error("User Not Exists")
          }


          const check_password =await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,values.password)
          //console.log(result)
          
          if(check_password != result.password){
              throw new Error("Invalid Credentials")
          }

await SecureStore.setItemAsync('user',result?.id?.toString())



      helpers.resetForm()
      router.dismissTo('/(auth)/Dashboard')

    } catch (error:any) {
      Alert.alert("Error",error?.message)
   
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
            <Text>Email</Text>
            <TextInput keyboardType="email-address" value={values.email} onChangeText={(text)=>setFieldValue('email',text)} className="w-full py-3 border  rounded-full border-gray-400 px-3 " placeholder="Enter Your Name" />
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

        <LoaderButton  onpress={handleSubmit} text="Login" loading={loading} />

<View className="flex flex-row items-center my-4">
  <View className="flex-1 h-[1px] bg-gray-600" />
  <Text className="px-2 text-gray-500">OR</Text>
  <View className="flex-1 h-[1px] bg-gray-600" />
</View>

<Link href={'/(auth)/Register'} className="text-center text-blue-500 text-2xl">
Create Account 
</Link>



        </View> 

    )}

        </Formik>
   </SafeAreaView>
  );
}
