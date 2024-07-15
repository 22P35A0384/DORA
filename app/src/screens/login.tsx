import React, { useState, useEffect } from 'react';
import { Button, Pressable, StyleSheet, Text, View, ImageBackground, SafeAreaView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RootStackParamList } from '../App';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: LoginProps) => {
  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        // Navigate to Home screen if user is already logged in
        navigation.replace('Home');
      }
    };

    checkLoginStatus();
  }, []);

  const backAction = () => {
    console.log('Back button pressed!');
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = {
    user: username,
    pass: password,
  };

  const handleLogin = async () => {
    if (username === '') {
      Alert.alert('Enter User Name');
      return;
    } else if (password === '') {
      Alert.alert('Enter Password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://api-2d566yk43a-uc.a.run.app/checkmail', login);
      console.log(response.data)
      if (response.data.msg === 'Invalid User!') {
        Alert.alert('Invalid User! (or) Account Was Not Registered');
      } else if (response.data === false) {
        Alert.alert('Invalid Password!');
      } else {
        await AsyncStorage.setItem('user', username);
        if (username === 'admin@doraagent.com') {
          navigation.navigate('Admin');
        } else {
          navigation.replace('Home');
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Newaccount');
  };

  const handleForgotPassword = () => {
    navigation.navigate('Forgotpass');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.innerContainer}>
          <Image source={require('../media/logo.png')} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to Dora!</Text>
          <TextInput
            placeholder="Email ID"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.newUserText}>New User?</Text>
            <TouchableOpacity onPress={handleCreateAccount} style={styles.registerButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color:'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    color: '#4F4F4F',
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#3498db',
    marginTop: 10,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newUserText: {
    fontSize: 16,
    color: '#4F4F4F',
  },
  registerButton: {
    marginLeft: 5,
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
