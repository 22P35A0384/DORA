import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { BackHandler } from 'react-native';

type ForgotpassProps = NativeStackScreenProps<RootStackParamList, 'Forgotpass'>;

const Forgotpass = ({ navigation }: ForgotpassProps) => {
    const backAction = () => {
        console.log('Back button pressed!');
        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    const [Data, SetData] = useState({
        email: '',
        newpass: '',
        cnfnewpass: ''
    });

    const [upper, setupper] = useState(0);
    const [lower, setlower] = useState(0);
    const [spc, setspc] = useState(0);
    const [num, setnum] = useState(0);
    const [len, setlen] = useState(0);
    const [otp, setnewotp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const sp = "~@`!#$%^&*+=-[]()_.';,/{}|\":<>?";

    const checkpass = (text: string) => {
        let upper = 0, lower = 0, spc = 0, num = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === text[i].toUpperCase() && isNaN(Number(text[i])) && !sp.includes(text[i])) {
                upper++;
            } else if (text[i] === text[i].toLowerCase() && isNaN(Number(text[i])) && !sp.includes(text[i])) {
                lower++;
            } else if (sp.includes(text[i])) {
                spc++;
            } else {
                num++;
            }
        }
        setupper(upper);
        setlower(lower);
        setspc(spc);
        setnum(num);
        setlen(text.length);
    };

    const otpRefs = useRef<Array<TextInput | null>>([]);
    const [userotp, setOtp] = useState(Array(6).fill(''));

    const handleInputChange = (value: string, index: number) => {
        const newOtp = [...userotp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const Otpfun = async () => {
        const userotp1 = userotp.join('');
        if (userotp1 === String(otp)) {
            try {
                await axios.put('https://api-2d566yk43a-uc.a.run.app/updatepass', Data);
                Alert.alert("Success", "Password Updated Successfully");
                navigation.navigate('Login');
            } catch (err) {
                Alert.alert("Error", "Failed to update password");
            }
        } else {
            Alert.alert("Error", "Invalid OTP");
        }
    };

    const Resetpassword = async () => {
        if (Data.email === '') {
            Alert.alert('Enter Your Email');
        } else if (Data.newpass === '') {
            Alert.alert('Create A New Password');
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
        } else if (Data.cnfnewpass === '') {
            Alert.alert('Re-Enter Your New Password');
        } else if (Data.newpass !== Data.cnfnewpass) {
            Alert.alert('Password Mismatch');
        } else {
            setLoading(true);
            try {
                const res = await axios.get(`https://api-2d566yk43a-uc.a.run.app/forgotpassword/${Data.email}`);
                if (res.data) {
                    setShowOtp(true);
                    setnewotp(res.data);
                } else {
                    Alert.alert('Error', 'Account Not Found');
                }
            } catch (err) {
                Alert.alert("Error", "Failed to request OTP");
            } finally {
                setLoading(false);
            }
        }
    };

    const Login = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.innerContainer}>
                    <Image source={require('../media/logo.png')} style={styles.logo} />
                    <Text style={styles.registerText}>Reset Password</Text>
                    <TextInput
                        placeholder="Enter Your Email"
                        placeholderTextColor='gray'
                        style={styles.input}
                        onChangeText={(text) => SetData({ ...Data, email: text })}
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Enter A New Password"
                        placeholderTextColor='gray'
                        style={styles.input}
                        onChangeText={(text) => {
                            SetData({ ...Data, newpass: text });
                            checkpass(text);
                        }}
                        secureTextEntry
                    />
                    <TextInput
                        placeholder="Re-Enter Your New Password"
                        placeholderTextColor='gray'
                        style={styles.input}
                        onChangeText={(text) => SetData({ ...Data, cnfnewpass: text })}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={Resetpassword} style={styles.button}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Reset Password</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={Login}>
                        <Text style={styles.forgotPasswordText}>Back to LOGIN</Text>
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
                                    {userotp.map((otpValue, index) => (
                                        <TextInput
                                            key={index}
                                            style={styles.otpInput}
                                            maxLength={1}
                                            onChangeText={(text) => handleInputChange(text, index)}
                                            onKeyPress={(e) => handleKeyDown(e, index)}
                                            keyboardType="numeric"
                                            ref={(ref) => otpRefs.current[index] = ref}
                                            value={otpValue}
                                        />
                                    ))}
                                </View>
                                <TouchableOpacity onPress={Otpfun} style={styles.button}>
                                    <Text style={styles.buttonText}>SUBMIT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Forgotpass;

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
        // marginBottom: 20,
    },
    registerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '100%',
        marginBottom: 20,
        color: '#4F4F4F',
    },
    forgotPasswordText: {
        alignSelf: 'flex-end',
        color: '#3498db',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6C63FF',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    otpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color:"black"
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        borderBottomWidth: 2,
        borderColor: '#ccc',
        padding: 10,
        textAlign: 'center',
        fontSize: 18,
        width: '12%',
        color:"black"
    },
});
