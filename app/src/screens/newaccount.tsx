import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NewaccountProps = NativeStackScreenProps<RootStackParamList, 'Newaccount'>

const Newaccount = ({ navigation }: NewaccountProps) => {
  const [newuser, getnewuser] = useState({
    fname: '',
    lname: '',
    password: '',
    email: '',
    cnfpass: '',
    myimg: ''
  });

  const [image, setImage] = useState('');
  const [upper, setupper] = useState(0);
  const [lower, setlower] = useState(0);
  const [spc, setspc] = useState(0);
  const [num, setnum] = useState(0);
  const [len, setlen] = useState(0);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const sp = "~@`!#$%^&*+=-[]()_.';,/{}|\":<>?";

  const pickImage = async () => {
    Alert.alert('This Feature Will Come Soon')
  };

  const checkpass = (e: any) => {
    const x = e;
    let upper = 0;
    let lower = 0;
    let spc = 0;
    let num = 0;
    for (let i = 0; i < x.length; i++) {
      if (x[i] === x[i].toUpperCase() && isNaN(x[i]) && !(sp.includes(x[i]))) {
        upper += 1;
      } else if (x[i] === x[i].toLowerCase() && isNaN(x[i]) && !(sp.includes(x[i]))) {
        lower++;
      } else if (sp.includes(x[i])) {
        spc++;
      } else {
        num++;
      }
    }
    setupper(upper);
    setlower(lower);
    setspc(spc);
    setnum(num);
    setlen(x.length);
  };

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [uotp, setuotp] = useState<string[]>(Array(6).fill(''))

  const handleOtpChange = (value: string, index: number) => {
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    const newValues = [...uotp];
    newValues[index] = value;
    setuotp(newValues);
    // console.log(newValues)
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const Login = () => {
    try {
      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
    }
  };

  const Createuser = async () => {
    if (newuser.fname === '') {
      Alert.alert('Enter Your First Name');
    } else if (newuser.lname === '') {
      Alert.alert('Enter Your Last Name');
    } else if (newuser.email === '') {
      Alert.alert('Enter Your Email');
    } else if (newuser.password === '') {
      Alert.alert('Create a Password');
    } else if (upper === 0) {
      Alert.alert('Password Must Contain One Capital Letter');
    } else if (lower === 0) {
      Alert.alert('Password Must Contain One Lowercase Letter');
    } else if (spc === 0) {
      Alert.alert('Password Must Contain One Special Character');
    } else if (num === 0) {
      Alert.alert('Password Must Contain One Number');
    } else if (len < 8) {
      Alert.alert('Password Must Contain At Least 8 Characters');
    } else if (newuser.cnfpass === '') {
      Alert.alert('Re-enter Your Password to Confirm');
    } else if (newuser.password !== newuser.cnfpass) {
      Alert.alert('Password Mismatch');
    } else {
      const backendmail = newuser.email;
      try {
        const Usermailcheck = await axios.get(`https://api-2d566yk43a-uc.a.run.app/checkusermail/${backendmail}`)
        console.log(Usermailcheck.data)
        if (Usermailcheck.data) {
          try {
            const res = await axios.get(`https://api-2d566yk43a-uc.a.run.app/checkmail/${backendmail}`);
            if (res.data) {
              setShowOtp(true);
              const response = await axios.get(`https://api-2d566yk43a-uc.a.run.app/sendotp/${backendmail}`);
              setOtp(response.data.otp);
              // console.log(response.data.otp)
            } else {
              Alert.alert('This Email Is Already Registered!');
            }
          } catch (err) {
            console.log(err);
            Alert.alert('Error', 'An error occurred. Please try again.');
          }
        } else {
          Alert.alert("This Mail I'd Was Not Allowed To Create A Account, Please Contact Admin Department!!!")
          navigation.navigate('Login');
        }
      } catch (err) {
        console.log(err)
      }
    }
  };

  const Otpfun = async () => {
    // const userotp = uotp.join('')
    // console.log(userotp)
    try {
      const userotp1 = uotp;
      const newotp = String(otp);
      let c = 0;
      for (let i = 0; i < 6; i++) {
        if (newotp[i] === userotp1[i]) {
          c++;
        }
      }
      if (c === 6) {
        // const Senddata = new FormData();
        // Senddata.append('fname', newuser.fname);
        // Senddata.append('lname', newuser.lname);
        // Senddata.append('password', newuser.password);
        // Senddata.append('email', newuser.email);
        // Senddata.append('myimg', newuser.myimg);
        const Senddata = {
          "fname": newuser.fname,
          "lname": newuser.lname,
          "password": newuser.password,
          "email": newuser.email,
          "profile": ''
        }
        const result = await axios.post('https://api-2d566yk43a-uc.a.run.app/addnewuser', Senddata)
        // Alert.alert('Testing')
        Alert.alert(result.data.msg);
        navigation.navigate('Login');
      } else {
        Alert.alert('Invalid OTP');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Image source={require('../media/logo.png')} style={styles.profileImage} />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor='#4F4F4F'
        onChangeText={(text) => getnewuser({ ...newuser, fname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor='#4F4F4F'
        onChangeText={(text) => getnewuser({ ...newuser, lname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor='#4F4F4F'
        onChangeText={(text) => getnewuser({ ...newuser, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor='#4F4F4F'
        onChangeText={(text) => {
          getnewuser({ ...newuser, password: text });
          checkpass(text);
        }}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor='#4F4F4F'
        onChangeText={(text) => getnewuser({ ...newuser, cnfpass: text })}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={Createuser}
        style={styles.button}
      >
        <Text style={styles.btntext}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <Modal
        visible={showOtp}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.otpTitle}>Please Enter OTP!</Text>
            <View style={styles.otpInputContainer}>
              {new Array(6).fill(null).map((_, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  maxLength={1}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current[index] = ref}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={Otpfun}
              style={styles.button}
            >
              <Text style={styles.btntext}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={Login}
        style={styles.button2}
      >
        <Text style={styles.btntext2}>BACK TO LOGIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Newaccount;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderColor: '#ccc',
    textAlign: 'center',
    color: 'black'
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  button2: {
    padding: 10,
    alignItems: 'center',
    width: '80%',
    backgroundColor: "green",
    marginBottom: 12,
    borderRadius: 20
  },
  btntext2: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    marginRight: 5,
    color: 'black'
  },
});
