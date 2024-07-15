import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, ImageBackground, Modal, StyleSheet, Text, View, PermissionsAndroid, Platform, TouchableOpacity, Image, ActivityIndicator, TextInput, ScrollView, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { RootStackParamList } from '../App';
import { Dimensions } from 'react-native';
import axios from 'axios';
var RNFS = require('react-native-fs');
import Video, { VideoRef } from 'react-native-video';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: 'r8_0g5MN2nEPg27Q7gLl88FCZffIbLUV8H028SuW',
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<HomeProps> = ({ navigation }: HomeProps) => {
  const backAction = () => {
    console.log('Back button pressed!');
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUri, setFullImageUri] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('');
  const [hairstyle, setHairstyle] = useState<string>('');
  const [showresult, setshowresult] = useState(false)

  const cameraRef = useRef<RNCamera | null>(null);
  const videoRef = useRef<VideoRef>(null);
  const backgroundVideo = require('../media/loader.mp4');

  const menHairstyles = ['Buzz Cut', 'Crew Cut', 'Faux Hawk', 'Pompadour', 'Undercut', 'Quiff', 'Side Part', 'Slick Back', 'Comb Over', 'Top Knot'];
  const womenHairstyles = ['Bob', 'Lob', 'Pixie', 'Shag', 'Layered', 'Curly', 'Straight', 'Wavy', 'Braided', 'Bun'];

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
    setTimeout(() => setLoading(false), 3000);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    if (showresult) {
      setshowresult(false);
      return true; // Prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to the camera to take hair photos.',
            buttonPositive: 'Grant Permission',
            buttonNegative: 'Cancel',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.warn('Camera permission denied');
          Alert.alert(
            'Permission Denied',
            'You need to grant camera permission to use the app features.',
            [{ text: 'OK', onPress: () => {} }]
          );
        }
      } catch (err) {
        console.warn('Failed to request camera permission:', err);
      }
    }
  };

  const toggleFullImage = (uri: string) => {
    setFullImageUri(uri);
    setShowFullImage(!showFullImage);
  };

  const renderFullImage = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFullImage}
      onRequestClose={() => toggleFullImage('')}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalCloseButton} onPress={() => toggleFullImage('')}>
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
        <Image source={{ uri: fullImageUri }} style={styles.fullImage} resizeMode="contain" />
      </View>
    </Modal>
  );

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      console.warn('Camera ref not set');
      return;
    }

    try {
      const options = { quality: 0.8 };
      const data = await cameraRef.current.takePictureAsync(options);
      setSelectedImage(data.uri);
      setShowCamera(false);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Failed to take photo');
    }
  };


  const handleAnalyzeHair = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user')
    const uri = selectedImage;
    if (uri && RNFS) {
      try {
        const base64String = await RNFS.readFile(uri, 'base64');
        const requestData = {
          gender,
          hairstyle,
          user,
        };
        const res = await axios.post('https://api-2d566yk43a-uc.a.run.app/ImgGeneration', requestData);
        console.log(res.data)
        if(res.data===false){
          Alert.alert('Usage Alet!','You Reached Your Usage Limit!!!')
          setSelectedImage(null);
          setImageUrls([]);
          setGender('');
          setHairstyle('');
          console.log(res.data)
        }else{
          const reference_face_1 = `data:application/octet-stream;base64,${base64String}`;
          const output = await replicate.run(
            "zsxkib/flash-face:edb17f54faec253ee86e58e0b5f18f24a89c4e31fe7fcefa970e13d8ad934117",
            {
              input: {
                seed: 0,
                steps: 20,
                num_sample: 5,
                face_guidance: 2.5,
                lamda_feature: 0.9,
                output_format: "webp",
                output_quality: 80,
                negative_prompt: "nsfw",
                positive_prompt: `A ${requestData.gender} with ${requestData.hairstyle} hair cut is in a empty room with plain background`,
                reference_face_1: reference_face_1,
                face_bounding_box: "[0., 0., 0., 0.]",
                text_control_scale: 7.5,
                default_negative_prompt: "blurry, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face",
                default_position_prompt: "best quality, masterpiece,ultra-detailed, UHD 4K, photographic",
                step_to_launch_face_guidance: 700
              }
            }
          );
          if (Array.isArray(output)) {
            setImageUrls(output);
            setshowresult(true);
          } else {
            console.log('Unexpected response format', output);
            Alert.alert('Got Invalid Responce From API Service Provider');
          }
        }
        // console.log(user)
      } catch (err) {
        console.log('Error converting image to base64 or analyzing hair', err);
        Alert.alert('Failed to analyze hair');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('No photo taken or RNFS not available');
      setLoading(false);
    }
  };

  const retake = () => {
    setSelectedImage(null);
    setImageUrls([]);
    setGender('');
    setHairstyle('')
  };

  const Logout = () =>{
    AsyncStorage.removeItem('user')
    navigation.replace('Login');
  }

  return (
    <>
      {loading ? (
        <View style={styles.loading}>
          <Video
            source={backgroundVideo}
            ref={videoRef}
            style={styles.backgroundVideo}
            repeat={true}
            onLoad={() => console.log('Video is loaded')}
            onError={(error) => console.error('Video loading error:', error)}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.banner}>
            <View style={styles.header}>
              <Image source={require('../media/logo.png')} style={styles.logo} />
              <Text style={styles.welcomeText}>Welcome to Dora!</Text>
            </View>
            <View style={styles.captureContainer}>
              <Text style={styles.captureText}>Capture Customer's Image</Text>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.capturedImage} />
              ) : (
                <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.captureButton}>
                  <Image source={require('../media/camera_icon.png')} style={styles.cameraIcon} />
                </TouchableOpacity>
              )}
            </View>

            {selectedImage && (
              <View style={styles.selectionContainer}>
                <Text style={styles.label}>Choose Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'Men' && styles.genderButtonSelected]}
                    onPress={() => setGender('Men')}
                  >
                    <Text style={styles.genderButtonText}>Men</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'Women' && styles.genderButtonSelected]}
                    onPress={() => setGender('Women')}
                  >
                    <Text style={styles.genderButtonText}>Women</Text>
                  </TouchableOpacity>
                </View>

                {gender && (
                  <>
                    <Text style={styles.label}>Choose Hairstyle</Text>
                    <Picker
                      selectedValue={hairstyle}
                      style={styles.hairstylePicker}
                      dropdownIconColor={'black'}
                      onValueChange={(itemValue: React.SetStateAction<string>) => setHairstyle(itemValue)}
                    >
                      <Picker.Item label="Select Hairstyle" color='black' value="" />
                      {gender === 'Men' && menHairstyles.map((style) => (
                        <Picker.Item key={style} label={style} value={style} />
                      ))}
                      {gender === 'Women' && womenHairstyles.map((style) => (
                        <Picker.Item key={style} label={style} value={style} />
                      ))}
                    </Picker>

                    <TouchableOpacity 
                      style={[styles.generateButton, selectedImage && gender && hairstyle ? null : { backgroundColor: '#aaa' }]}
                      onPress={handleAnalyzeHair}
                      disabled={!(selectedImage && gender && hairstyle)}
                    >
                      <Text style={styles.generateButtonText}>Generate Output!</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {showCamera && (
              <Modal animationType="slide" transparent={false} visible={showCamera} onRequestClose={() => setShowCamera(false)}>
              <RNCamera
                ref={cameraRef}
                style={styles.fullScreenCamera}
                captureAudio={false}
                onMountError={(error) => {
                  console.error('Camera mount error:', error);
                  Alert.alert('Failed to open camera', error.message);
                }}
                androidCameraPermissionOptions={{
                  title: 'Camera Permission',
                  message: 'This app needs access to the camera to take hair photos.',
                  buttonPositive: 'Grant Permission',
                  buttonNegative: 'Cancel',
                }}
              >
                <View style={styles.captureButtonContainer}>
                  <TouchableOpacity onPress={handleTakePhoto} style={styles.captureButton1}>
                    <Image source={require('../media/camicon.jpg')} style={styles.cameraIcon1} />
                  </TouchableOpacity>
                </View>
              </RNCamera>
              </Modal>
            )}

            {selectedImage && (
              <TouchableOpacity style={styles.retakeButton} onPress={retake}>
                <Text style={styles.generateButtonText}>Retake</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.retakeButton1} onPress={Logout}>
              <Text style={styles.generateButtonText1}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
          {/* {showresult && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results:</Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {imageUrls.map((url, index) => (
                  <TouchableOpacity key={index} onPress={() => toggleFullImage(url)}>
                    <Image source={{ uri: url }} style={styles.resultImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )} */}
          {showresult && (
            <Modal animationType="slide" transparent={false} visible={showresult} onRequestClose={() => setshowresult(false)}>
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Results:</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {imageUrls.map((url, index) => (
                    <TouchableOpacity key={index} onPress={() => toggleFullImage(url)}>
                      <Image source={{ uri: url }} style={styles.resultImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          )}
        </View>
      )}
      {renderFullImage()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  banner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#F5FCFF',
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'black'
  },
  captureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 10,
  },
  captureText: {
    fontSize: 16,
    marginBottom: 10,
    color:'black'
  },
  captureButton: {
    width: 250,
    height: 250,
    borderRadius: 40,
    backgroundColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 150,
    height: 150,
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectionContainer: {
    width: '100%',
    // marginBottom: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop:30,
    color:'black'
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#e1e1e1',
  },
  genderButtonSelected: {
    backgroundColor: 'rgb(113, 204, 195)',
  },
  genderButtonText: {
    fontSize: 16,
    color: 'white',
  },
  hairstylePicker: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    color:'black'
  },
  generateButton: {
    width:200,
    backgroundColor: 'rgb(113, 204, 195)',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 10,
  },
  generateButtonText: {
    fontSize: 16,
    color: 'white',
  },
  fullScreenCamera: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton1: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
    alignSelf: 'center',
    margin: 20,
  },
  cameraIcon1: {
    width: 80,
    height: 80,
  },
  retakeButton: {
    width:200,
    backgroundColor: 'rgb(113, 204, 195)',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 10,
  },
  retakeButton1: {
    width:200,
    backgroundColor: 'rgb(113, 204, 195)',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    // marginVertical: 10,
    position:'absolute',
    bottom:20
  },
  generateButtonText1: {
    fontSize: 16,
    color: 'white',
  },
  resultsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor:'white'
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  resultImage: {
    width:'100%',
    height:300,
    borderRadius: 10,
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});

export default Home;