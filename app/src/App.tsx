import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/home";
import Details from "./screens/details";
import Login from "./screens/login";
import Logout from "./screens/logout";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Newaccount from "./screens/newaccount";
import Forgotpass from "./screens/forgotpass";
import Admin from "./screens/admin";

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Home: undefined;
  Details:undefined;
  Login:undefined;
  Logout:undefined;
  Newaccount:undefined;
  Forgotpass:undefined;
  Admin:undefined;
  Analyze: { images: string[] }
};

const Stack = createNativeStackNavigator<RootStackParamList>()

function App():JSX.Element{
  return(
    <>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown:false
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Details"
          component={Details}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Newaccount"
          component={Newaccount}
        />
        <Stack.Screen
          name="Forgotpass"
          component={Forgotpass}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
        />
        {/* <Stack.Screen
          name="Logout"
          component={Logout}
        /> */}
      </Stack.Navigator>
      {/* <Button
        title="LOGIN"
        onPress={()=>{}}
      /> */}
    </NavigationContainer>
    </>
  )
}

export default App;