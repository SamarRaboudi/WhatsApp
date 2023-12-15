import React from 'react';

import SignUp from './screens/SignUp'; // Import the Sign Up component
import Auth from './screens/Auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Chat from './screens/Chat';
import LocationPickerScreen from './screens/LocationPickerScreen';
import CreateGroup from './screens/CreateGroup';
import GroupChat from './screens/GroupChat';
import EditGroup from './screens/EditGroup';



const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Auth}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Chat" component={Chat}/>
        <Stack.Screen name="LocationPickerScreen" component={LocationPickerScreen}/>
        <Stack.Screen name="CreateGroup" component={CreateGroup}/>
        <Stack.Screen name="GroupChat" component={GroupChat}/>
        <Stack.Screen name="EditGroup" component={EditGroup}/>


      </Stack.Navigator> 
    </NavigationContainer>
  );
}
