import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminProps = NativeStackScreenProps<RootStackParamList, 'Admin'>;

const Admin = ({ navigation }: AdminProps) => {
    const [Data, SetData] = useState({
        email: ''
    });
    const [userListModalVisible, setUserListModalVisible] = useState(false);
    const [userList, setUserList] = useState<any[]>([]); // Adjust type according to your API response

    const Adduser = async () => {
        if (Data.email === '') {
            Alert.alert("Please Enter User's mail I'd...!")
        } else {
            const response = await axios.post('https://api-2d566yk43a-uc.a.run.app/updateuserlist', Data)
            Alert.alert(response.data.msg)
            // console.log(response.data.msg)
        }
    };

    const Removeuser = async () => {
        if (Data.email === '') {
            Alert.alert("Please Enter User's mail I'd...!")
        } else {
            const response = await axios.post('https://api-2d566yk43a-uc.a.run.app/removeuser', Data)
            Alert.alert(response.data.msg)
            // console.log(response.data.msg)
        }
    };

    const fetchUserList = async () => {
        try {
            const response = await axios.get('https://api-2d566yk43a-uc.a.run.app/getuserlist');
            setUserList(response.data); // Assuming response.data is an array of users with '_id', 'mail', and 'count'
            console.log(userList)
            setUserListModalVisible(true);
        } catch (error) {
            console.error('Error fetching user list:', error);
            Alert.alert('Failed to fetch user list.');
        }
    };

    const Logout = () => {
        AsyncStorage.removeItem('user')
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.maintittle}>USER WHITE LIST</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Your Email"
                placeholderTextColor='black'
                onChangeText={(text) => SetData({ ...Data, email: text })}
                keyboardType="email-address"
            />
            <TouchableOpacity
                onPress={Adduser}
                style={styles.button}
            >
                <Text style={styles.btntext}>Add User</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={Removeuser}
                style={styles.button1}
            >
                <Text style={styles.btntext}>Remove User</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={fetchUserList}
                style={styles.button}
            >
                <Text style={styles.btntext}>Show User List</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={Logout}
                style={styles.button2}
            >
                <Text style={styles.btntext2}>LOGOUT</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={userListModalVisible}
                onRequestClose={() => setUserListModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>User List</Text>
                        {userList.map((user, index) => (
                            <View key={index} style={styles.userItem}>
                                <Text style={styles.modalText}>{user.mail}</Text>
                                <Text style={styles.modalText}>Count: {user.count}</Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setUserListModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Admin;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    maintittle: {
        color: 'red',
        fontSize: 28,
        marginBottom: 50
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
    button: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
        marginBottom: 20,
    },
    button1: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        minWidth: '80%',
        minHeight: '40%'
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 10,
        fontSize: 16,
        color:'black'
    },
    userItem: {
        marginBottom: 20,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
