import { View, StyleSheet, Text, TextInput, Dimensions, ImageBackground, NativeAppEventEmitter } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRef, useState } from 'react';
import firebase from '../config'; 

const auth = firebase.auth();

export default function Auth(props) {
  const [email, setemail] = useState("test1@gmail.com")
  const [pwd, setpwd] = useState("123456")
  const refinput2 = useRef();


  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >

      <View style={styles.container}>
        <Text style={styles.title}>Authentication</Text>
       {/*  <Text style={styles.subtitle}>Sign in to your account!</Text> */}
       <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#FC8EAC" style={styles.icon} />
        <TextInput
          onChangeText={(text) => {
            setemail(text)
          }}
          onSubmitEditing={()=> { refinput2.current.focus();}}
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
          style={styles.input}
          placeholderTextColor="#555555"
        />
      </View>
        <Text style={styles.forgotPwd}>Forgot your password?</Text>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => {
            if(email && pwd)
             auth.signInWithEmailAndPassword(email.trim(),pwd.trim())
             .then(()=>{
              const currentid = auth.currentUser.uid;
               props.navigation.navigate("Home",{currentid: currentid})
             })
             .catch((err)=>{alert(err)});
            
           }}
        >
          Login
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
        <Text style={styles.bottomText}>Don't have an account?</Text> 
        <Button 
        style={styles.bottomBtn}
        labelStyle={styles.bottomBtnText} 
        onPress={() => {
          props.navigation.navigate("SignUp")
        }}
        > Sign up</Button>
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
    paddingTop:95,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FC8EAC',
    padding: 10,
    width: '80%',
    height: 50,
    marginTop: 25,
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
    textShadowColor: '#fff', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 3,
    marginBottom: 40,
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
  forgotPwd: {
    marginTop: 15,
    marginBottom: 20,
    color: '#555555',
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
