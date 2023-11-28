
import React from 'react';
import { View, StyleSheet, Text, ImageBackground, BackHandler,TextInput } from 'react-native'; // Import ImageBackground
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRef, useState} from 'react';
import firebase from '../config'; 

const auth = firebase.auth();

export default function SignUp(props) {
    const [email, setemail] = useState()
    const [pwd, setpwd] = useState()
    const [cpwd, setcpwd] = useState()
    const refinput2 = useRef();
    const refinput3 = useRef();
  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>
        
       <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#FC8EAC" style={styles.icon} />
        <TextInput
          onChangeText={(text) => {
            setemail(text)
          }}
          onSubmitEditing={()=> {refinput2.current.focus();}}
          blurOnSubmit={false}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555555"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#FC8EAC" style={styles.icon} />
        <TextInput
          ref={refinput2}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            setpwd(text)
          }}
          onSubmitEditing={()=> {refinput3.current.focus();}}
          style={styles.input}
          placeholderTextColor="#555555"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#FC8EAC" style={styles.icon} />
        <TextInput
          placeholder=" Comfirm Password"
          secureTextEntry={true}
          onChangeText={(text) => {
           setcpwd(text)
          }}
          ref={refinput3}
          style={styles.input}
          placeholderTextColor="#555555"
        />
      </View>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => {
           if(pwd === cpwd)
           {
            auth.createUserWithEmailAndPassword(email,pwd)
            .then(()=>{
              props.navigation.navigate("Home")
            })
            .catch((err)=>{alert(err)});
           }
           
          }}
        >
          Sign Up
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => {
            BackHandler.exitApp();
          }}
        >
         Cancel
        </Button>
        <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Already have an account?</Text> 
        <Button 
        style={styles.bottomBtn}
        labelStyle={styles.bottomBtnText} 
        onPress={()=>{
          props.navigation.navigate("Login")
        }}
        >Login</Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Set background to transparent
    justifyContent:'flex-start',
    paddingTop:100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FC8EAC',
    padding: 10,
    width: '80%',
    height: 50,
    marginBottom: 25,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#111111',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FC8EAC',
    textShadowColor: '#fff', // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 3, // Shadow radius
    marginBottom: 50,
  },
  subtitle: {
    color: '#0C0908',
    fontSize: 16,
  },
  button: {
    width: '40%',
    marginTop: 20,
    height: 45,
    color: '#000',
    backgroundColor: '#FC8EAC',
 
  },
  bottomContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    color: '#555555', 
  },
  bottomText: {
    color: '#555555',
  },
  bottomBtnText: {
    color: '#555555',
    borderBottomWidth: 1.2, // Set the desired width for the underline
    borderBottomColor: '#555555',
  },
});
