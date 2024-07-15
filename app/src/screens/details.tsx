import { Button, StyleSheet, Text, View, Alert } from 'react-native'
import React from 'react'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../App'
import AsyncStorage from '@react-native-async-storage/async-storage'

type DetailsProps = NativeStackScreenProps<RootStackParamList, 'Details'>

const Details = ({navigation}:DetailsProps) => {
  const LogOut=()=>{
    try{
      AsyncStorage.removeItem('user')
      navigation.navigate('Login')
      console.log('Logged Out Sucesfully')
    }catch(err){
      console.log(err)
      Alert.alert('Failed To Logout')
    }
  }
  return (
    <View>
      <Text style={styles.text}>Details</Text>
      <Button
        title='LOGOUT'
        onPress={()=>{LogOut()}}
      />
    </View>
  )
}

export default Details

const styles = StyleSheet.create({
  text:{
    color:'#000000'
  }
})