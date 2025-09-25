import { getDB } from '@/config/db';
import { useAuthContext } from '@/context/AuthContext';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from 'expo-secure-store';
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

const UpdateAvatar = () => {
    const {user} = useAuthContext()
  const [image, setImage] = useState<string | null>(null);
  //console.log(user)

  // ✅ helper to save picked image permanently
  const saveFile = async (uri: string) => {
    try {
      const fileName = uri.split("/").pop();
      const baseDir:any =FileSystem?.documentDirectory as any // safe fallback
      const newPath = baseDir + fileName;

      await FileSystem.copyAsync({ from: uri, to: newPath });
      return newPath;
    } catch (error) {
      console.error("File save error:", error);
      return uri; // fallback to temp URI
    }
  };

  const openOptions = () => {
    Alert.alert("Select Option", "Choose image source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Error", "Permission Denied!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const db = await getDB()
      const user = await SecureStore.getItemAsync("user")
      const savedPath = await saveFile(uri);
      const resultd=   await db.runAsync(`
        update users set image = ? where id=?;
        `,[savedPath,user])
        //console.log("resultd",resultd)
      setImage(savedPath);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Error", "Camera Permission Denied!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const savedPath = await saveFile(uri);

      const db = await getDB()
      const user = await SecureStore.getItemAsync("user")

      

   const resultd=   await db.runAsync(`
        update users set image = ? where id=?;
        `,[savedPath,user])

//console.log("resultd",resultd)
      setImage(savedPath);
    }
  };

  return (
    <View>
      <Pressable
        onPress={openOptions}
        className="w-[300px] h-[300px] border mx-auto rounded-full my-10 overflow-hidden items-center justify-center"
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%", borderRadius: 150 }}
          />
        ) : (
     
              <Image
            source={{ uri: user?.image }}
            style={{ width: "100%", height: "100%", borderRadius: 150 }}
          /> 
    
        )}
      </Pressable>
      
    </View>
  );
};

export default UpdateAvatar;

const styles = StyleSheet.create({});
