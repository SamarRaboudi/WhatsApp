import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../config';

const EditGroup = (props) => {
  const group = props.route.params.group;
  const currentid = props.route.params.currentid;

  const [groupName, setGroupName] = useState(group.groupName);
  const [isDefault, setIsDefault] = useState(false); 
  const [uriLocal, setUriLocal] = useState(group.url);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(group.members);
  const [loading, setLoading] = useState(true);

  const storage = firebase.storage();
  const database = firebase.database();

  useEffect(() => {
    // Fetch the list of profiles from the database
    const refProfiles = database.ref('profils');
  
    refProfiles.on('value', (snapshot) => {
      const profileList = snapshot.val();
      if (profileList) {
        // Filter out the current user from the list
        const filteredMembers = Object.values(profileList).filter((member) => member.id !== currentid);
        setMembers(filteredMembers);
  
        // Check if the creator is already in selectedMembers
        if (!selectedMembers.includes(group.creatorId)) {
          setSelectedMembers((prevSelectedMembers) => [...prevSelectedMembers, group.creatorId]);
        }
      }
      setLoading(false);
    });
  
    return () => {
      // Detach the event listener when the component unmounts
      refProfiles.off('value');
    };
  }, [currentid, group.creatorId, selectedMembers]);
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setIsDefault(false);
      setUriLocal(uri);
    }
  };

  const uploadLocalImageToStorage = async (uriLocal) => {
    try {
      const blob = await imageToBlob(uriLocal);
      const refMesImages = storage.ref('MyImages');
      const refOneImage = refMesImages.child('oneImage.jpg');
      await refOneImage.put(blob);
      const url = await refOneImage.getDownloadURL();
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
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const editGroup = async () => {
    try {
      const refGroups = database.ref('groups').child(group.id);
      const url = await uploadLocalImageToStorage(uriLocal);

      const updatedGroup = {
        groupName: groupName,
        url: url,
        members: selectedMembers,
        creatorId: group.creatorId, 
      };

      await refGroups.update(updatedGroup);
      console.log('Group updated successfully:', updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(memberId)) {
        // If the member is already selected, remove them
        return prevSelectedMembers.filter((id) => id !== memberId);
      } else {
        // If the member is not selected, add them
        return [...prevSelectedMembers, memberId];
      }
    });
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleMemberSelection(item.id)}
      style={[
        styles.memberItem,
        { backgroundColor: selectedMembers.includes(item.id) ? '#FC8EAC' : 'transparent' },
      ]}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.memberImage}
      />
      <View style={styles.memberInfo}>
        <Text style={{ color: selectedMembers.includes(item.id) ? 'white' : 'black' }}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/backgound.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#FC8EAC" />
            <Text style={styles.backButtonText}></Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Group</Text>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => pickImage()}>
            <Image
              source={isDefault ? require('../assets/camera.png') : { uri: uriLocal }}
              style={styles.accountImage}
            />
          </TouchableOpacity>

          {/* Group name input */}
          <TextInput
            style={styles.groupNameInput}
            placeholder="Enter Group Name"
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
          />
        </View>

        <View style={styles.membersContainer}>
          <Text style={{ marginBottom: 20, color: 'gray', fontSize: 16 }}>Select members:</Text>
          <FlatList
            style={{ width: '100%' }}
            data={members}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Edit group button */}
        <TouchableOpacity style={styles.addGroupButton} onPress={editGroup}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    width: '100%',
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    marginBottom: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FC8EAC',
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FC8EAC',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupNameInput: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#FC8EAC',
    borderRadius: 5,
    paddingLeft: 10,
  },
  membersContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FC8EAC',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  addGroupButton: {
    backgroundColor: '#FC8EAC',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditGroup;
