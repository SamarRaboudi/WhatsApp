import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import firebase from '../config';
import * as ImagePicker from 'expo-image-picker';

const database = firebase.database();
const storage = firebase.storage();

export default function MyAccount(props) {
  const currentid = props.route.params.currentid;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const refInput2 = useRef();
  const refInput3 = useRef();
  const [isDefault, setIsDefault] = useState(true);
  const [uriLocal, setUriLocal] = useState();

  useEffect(() => {
    // Fetch existing user data when the component mounts
    const refOneProfil = database.ref('profils/profil' + currentid);
    refOneProfil.once('value')
      .then(snapshot => {
        const profileData = snapshot.val();
        if (profileData) {
          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setPhone(profileData.phone || '');
          setUriLocal(profileData.url || '');
          setIsDefault(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [currentid]);

  const saveProfile = async () => {
    const refProfils = database.ref('profils');
    const key = refProfils.push().key;
    const refOneProfil = refProfils.child('profil' + currentid);

    const url = await uploadLocalImageToStorage(uriLocal);

    refOneProfil.set({
      id: currentid,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      url: url,
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.uri;
      setIsDefault(false);
      setUriLocal(uri);
    }
  };

  const uploadLocalImageToStorage = async (uriLocal) => {
    try {
      // Convert image to blob
      const blob = await imageToBlob(uriLocal);

      // Save blob to reference
      const ref_mes_images = storage.ref('MyImages');
      const ref_une_image = ref_mes_images.child('oneImage' + currentid + '.jpg');

      // Put blob and wait for it to complete
      await ref_une_image.put(blob);

      // Get download URL
      const url = await ref_une_image.getDownloadURL();

      return url;
    } catch (error) {
      console.error('Error uploading image to storage:', error);
      throw error;
    }
  };

  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob'; //bufferArray
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        props.navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
        Alert.alert('Error', 'An error occurred while logging out. Please try again.');
      });
  };

  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>My Account</Text>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={
              isDefault
                ? require('../assets/profil.jpg')
                : { uri: uriLocal }
            }
            style={styles.accountImage}
          />
        </TouchableOpacity>

        <TextInput
          onChangeText={(text) => setFirstName(text)}
          onSubmitEditing={() => refInput2.current.focus()}
          blurOnSubmit={false}
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#555555"
          value={firstName}
        />

        <TextInput
          onChangeText={(text) => setLastName(text)}
          ref={refInput2}
          onSubmitEditing={() => refInput3.current.focus()}
          blurOnSubmit={false}
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#555555"
          value={lastName}
        />

        <TextInput
          onChangeText={(text) => setPhone(text)}
          ref={refInput3}
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#555555"
          value={phone}
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
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
