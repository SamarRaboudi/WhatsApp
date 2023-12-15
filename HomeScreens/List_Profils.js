import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button, Dialog, IconButton } from 'react-native-paper';
import firebase from '../config';

const ProfileItem = ({ firstName, lastName, phone, url, onPress, navigation, currentid, item }) => (
  <View style={styles.profileItem}>
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: url }} style={styles.profileImage} />
    </TouchableOpacity>
    <View style={styles.profileInfo}>
      <Text style={styles.name}>{firstName} {lastName}</Text>
      <Text style={styles.phone}>{phone}</Text>
    </View>
    <IconButton
      icon="phone"
      color="#fff"
      size={20}
      style={styles.iconButton}
      onPress={() => {
        const phoneNumber = `tel:+216${phone}`;
        Linking.openURL(phoneNumber);
      }}
    />
    <IconButton
      icon="send"
      color="#fff"
      size={20}
      style={styles.iconButton}
      onPress={() => {
        navigation.navigate("Chat", { currentid, seconditem: item });
      }}
    />
  </View>
);


const database = firebase.database();

export default function List_Profils(props) {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentitem, setCurrentitem] = useState({
    firstName : "",
    lastName : "",
    phone : ""
  });
  const refProfils = database.ref('profils');
  const currentid = props.route.params.currentid;

  useEffect(() => {
    refProfils.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((un_profil) => {
        if(un_profil.val().id === currentid){
            setCurrentitem(un_profil.val());
        }else{
          d.push(un_profil.val());
        }
        
      });
      setData(d);
    });
    return () => {
      refProfils.off();
    };
  }, []);

  const openDialog = (profile) => {
    setSelectedProfile(profile);
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
    setSelectedProfile(null);
  };

  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profils List</Text>
        <FlatList
          style={styles.flatList}
          data={data}
          renderItem={({ item }) => (
            <ProfileItem
              {...item}
              onPress={() => openDialog(item)}
              navigation={props.navigation}
              currentid={currentid}
              item={item} 
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Dialog visible={visible} onDismiss={closeDialog}>
          <Dialog.Title>Details</Dialog.Title>
          <Dialog.Content style={{ padding: 10, alignItems: 'center' }}>
            {selectedProfile ? (
              <>
                <Image
                  resizeMode="center"
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={{ uri: selectedProfile.url }}
                />
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
                 {selectedProfile.firstName} {selectedProfile.lastName}
                </Text>
                <Text style={{ color: 'gray' }}>+216 {selectedProfile.phone}</Text>
              </>
            ) : (
              <Text>No profile selected</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Done</Button>
            <Button onPress={closeDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
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
    paddingTop: 50,
    width: '100%',
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
  flatList: {
    width: '90%',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
    elevation: 3,
    boxSizing: 'border-box',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    fontSize: 15,
    color: '#888',
  },
  iconButton: {
    backgroundColor: '#C7C7C7', 
    marginLeft: 5,
  },
});
