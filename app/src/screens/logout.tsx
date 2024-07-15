import { Alert, StyleSheet, Text, View } from 'react-native'
import React,{useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../App'

type LogoutProps = NativeStackScreenProps<RootStackParamList, 'Logout'>

const Logout = ({navigation}:LogoutProps) => {
  
  navigation.navigate('Login')
  // useEffect(() => {
  //   Alert.alert('test')
  //   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //     // Check if navigating back
  //     if (e.data.action.type === 'POP') {
  //       e.preventDefault(); // Prevent navigation back
  //       // Optionally display a message explaining why they can't go back
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  // try{
  //   AsyncStorage.removeItem('user')
  //   navigation.navigate('Login')
  // }catch(err){
  //   console.log(err)
  //   Alert.alert('Failed To Logout')
  // }
  return(
    <View></View>
  )
}

export default Logout

const styles = StyleSheet.create({
  text:{
    color:'#000000'
  }
})