import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import clsx from 'clsx';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LoaderButtonProps {
    text:string 
    loading?:boolean
    onpress:()=>void
}

const LoaderButton = (props:LoaderButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onpress} disabled={props.loading} className={clsx('w-full py-3 my-3  rounded flex-row justify-center  gap-x-2 items-center',!props.loading?'bg-gray-800':"bg-gray-600")}>
      <Text className='text-white text-center font-semibold'>{props.text}</Text>
      { props.loading ? <ActivityIndicator  color={'white'} /> : <FontAwesome5 name='arrow-right'  color={'white'}  size={14}/>}
    </TouchableOpacity>
  )
}

export default LoaderButton

const styles = StyleSheet.create({})