import { LoggedUser } from '@/types/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'

import { getDB } from '@/config/db'
import { NotesInterface } from '@/types/notes'
import { usePathname, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Toast from 'react-native-toast-message'
interface AuthContextTypes {
    user:LoggedUser | null
    logoutHandler :()=>Promise<void>,
    notes:NotesInterface[],
    fetchAllNotes:()=>Promise<void>
}

const AuthContext = createContext<AuthContextTypes>({
    user:null,
    async logoutHandler() {
        
    },
    notes:[],
   async fetchAllNotes() {
        
    },
})


export const useAuthContext = ()=> useContext(AuthContext)

const AuthContextProvider = ({children}:{children:React.ReactNode}) => {

const [user,setUser] = useState<LoggedUser | null>(null)
const [notes,setNotes] = useState<NotesInterface[]>([])

const router = useRouter()

const pathname = usePathname()



const logoutHandler = async()=>{
    try {
         await SecureStore.deleteItemAsync("user")
         setUser(null)
         router.dismissTo("/")
    } catch (error:any) {
      Alert.alert("error",error.message)
    }
}


const fetchUser=async()=>{
    try {
      
        const user = await SecureStore.getItemAsync("user")
        if(!user) return 

        const db=await getDB()

       const result:LoggedUser | null= await db.getFirstAsync(` 
            select * from users where id=?
            
            `,[user])

        if(!result){
            Toast.show({
                type:"error",
                swipeable:true,
                text1:"Error",
                text2:"Something Went Wrong"
            })
            router.dismissTo("/")
        }

        setUser(result)


    } catch (error:any) {
        Alert.alert("Error",error.message)
    }
}


const fetchAllNotes = async()=>{
            try {
                
                const db = await getDB()
                const user = await SecureStore.getItemAsync("user")

               const results:NotesInterface[]= await db.getAllAsync(`
                    select * from notes where user_id = ?
                    `,[user])

                    setNotes(results)


            } catch (error:any) {
                Alert.alert("error",error.message)
            }
}

useEffect(()=>{
    fetchUser()
    fetchAllNotes()
},[pathname])

  return (
    <>
      <AuthContext.Provider  value={{user,logoutHandler,notes,fetchAllNotes}}>{children}</AuthContext.Provider>
    </>
  )
}

export default AuthContextProvider

const styles = StyleSheet.create({})