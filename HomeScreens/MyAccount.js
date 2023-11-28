import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, TouchableOpacity, Image } from 'react-native';
import firebase from '../config';

const database = firebase.database();

export default function MyAccount() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const refInput2 = useRef();
  const refInput3 = useRef();

  const saveProfile = () => {
    const refProfils = database.ref('profils');
    const key = refProfils.push().key;
    const refOneProfil = refProfils.child('profil' + key);

    refOneProfil.set({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Account</Text>

        <Image source={require('../assets/profil.jpg')} style={styles.accountImage} />

        <TextInput
          onChangeText={(text) => setFirstName(text)}
          onSubmitEditing={() => refInput2.current.focus()}
          blurOnSubmit={false}
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#555555"
        />

        <TextInput
          onChangeText={(text) => setLastName(text)}
          ref={refInput2}
          onSubmitEditing={() => refInput3.current.focus()}
          blurOnSubmit={false}
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#555555"
        />

        <TextInput
          onChangeText={(text) => setPhone(text)}
          ref={refInput3}
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#555555"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={saveProfile}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FC8EAC',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  accountImage: {
    width: 120, 
    height: 120, 
    borderRadius: 80, 
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    width: '80%',
    height: 50,
    marginBottom: 25,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '40%',
    marginTop: 10,
    height: 45,
    borderColor: '#FC8EAC',
    borderWidth: 1,
    backgroundColor: '#FC8EAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
