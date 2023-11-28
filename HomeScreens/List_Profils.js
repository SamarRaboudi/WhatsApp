import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, FlatList } from 'react-native';

const data = [
  { firstName: 'John', lastName: 'Doe', phone: '555-1234' },
  { firstName: 'Jane', lastName: 'Smith', phone: '555-5678' },
];

const ProfileItem = ({ firstName, lastName, phone }) => (
  <View style={styles.profileItem}>
    <Image source={require('../assets/profil.jpg')} style={styles.profileImage} />
    <View style={styles.profileInfo}>
      <Text style={styles.name}>{firstName} {lastName}</Text>
      <Text style={styles.phone}>{phone}</Text>
    </View>
  </View>
);

export default function List_Profils() {
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
          renderItem={({ item }) => <ProfileItem {...item} />}
          keyExtractor={(item, index) => index.toString()}
        />
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
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingTop: 50,
    width: '100%', // Set the width of the container to 100%
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
    borderRadius: 15,
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
});
