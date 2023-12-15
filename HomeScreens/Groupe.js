import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from '../config';

export default function Groupe(props) {
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const refGroups = firebase.database().ref('groups');

    const unsubscribe = refGroups.on('value', (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {
        const groupsArray = Object.values(groupsData);

        // Filter groups based on membership
        const filteredGroups = groupsArray.filter(group => {
          // Check if the current user created the group or is a member
          return group.members.includes(currentid) || group.creatorId === currentid;
        });

        setGroups(filteredGroups);
      }
    });

    return () => {
      // Detach the event listener when the component unmounts
      unsubscribe();
    };
  }, [currentid]);

  const currentid = props.route.params.currentid;

  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Groups</Text>
        
        {/* "Create a new group" button */}
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => navigation.navigate('CreateGroup', { currentid })}
        >
          <Ionicons name="people" size={24} color="white" style={styles.createGroupIcon} />
          <Text style={styles.createGroupText}>Create a new group</Text>
        </TouchableOpacity>

        <FlatList
          style={styles.flatList}
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => {
                navigation.navigate("GroupChat", { currentid, group: item });
              }}
            >
              <Image source={{ uri: item.url }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <Text>{item.groupName}</Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={20}
                color="#000"
                style={styles.iconButton}
                onPress={() => {
                  navigation.navigate("EditGroup", { group: item });
                }}
              />
            </TouchableOpacity>
          )}
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
    justifyContent: 'flex-start',
    paddingTop: 50,
    width: '100%',
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FC8EAC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  createGroupIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  createGroupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  groupItem: {
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
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  iconButton: {
    backgroundColor: '#C7C7C7',
    marginLeft: 5,
  },
});
