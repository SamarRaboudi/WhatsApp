import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  FlatList,
  
} from 'react-native';
import { IconButton, Dialog, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from './ImageViewer';
import { format, isToday, isYesterday } from 'date-fns';
import MapView, { Marker } from 'react-native-maps';
import firebase from '../config';
import {
  LongPressGestureHandler,
  State,
  ScrollView as GestureHandlerScrollView,
} from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GroupChat = (props) => {
  const currentid = props.route.params.currentid;
  const group = props.route.params.group;

  const [messagesEnv, setMessagesEnv] = useState([]);
  const [messagesRec, setMessagesRec] = useState([]);
  const [writing, setWriting] = useState(false);
  const [msg, setMsg] = useState('');
  const [couleurb, setCouleurb] = useState('#FC8EAC');
  const [date, setDate] = useState(new Date());
  const [couleur, setCouleur] = useState('#FC8EAC');
  const [image, setImage] = useState(null);
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAttachmentDialogVisible, setAttachmentDialogVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [likedMessages, setLikedMessages] = useState([]);
  const [isEmojiDialogVisible, setEmojiDialogVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pressedMessage, setPressedMessage] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState({});
  const [profiles, setProfiles] = useState({});


  const openAttachmentDialog = () => {
    setAttachmentDialogVisible(true);
  };

  const closeAttachmentDialog = () => {
    setAttachmentDialogVisible(false);
  };

  const handleCameraPicker = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResult(result);
  };

  const handleImagePicker = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResult(result);
  };

  const handleImageResult = (result) => {
    if (result.canceled) {
      Alert.alert('Image picker was canceled');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else if (result.uri) {
      setImage(result.uri);
    }
  };

  const allMsgs = [...messagesEnv, ...messagesRec];
  const sortMsgs = allMsgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (messageDate) => {
    if (isToday(new Date(messageDate))) {
      return 'Today';
    } else if (isYesterday(new Date(messageDate))) {
      return 'Yesterday';
    } else {
      return format(new Date(messageDate), 'dd MMMM yyyy');
    }
  };

  useEffect(() => {
    const refGroups = firebase.database().ref('groups').child(group.id);
    const refGroupMessages = refGroups.child('messages');
    const refProfiles = firebase.database().ref('profils'); 
  
    const messagesList = refGroupMessages.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });
  
    // Fetch profiles
    const profilesList = refProfiles.on('value', (snapshot) => {
      const profilesData = snapshot.val();
      setProfiles(profilesData || {}); 
    });
  
    return () => {
      refGroupMessages.off('value', messagesList);
      refProfiles.off('value', profilesList);
    };
  }, [group.id]);
  

  const sendMessage = () => {
    if (msg.trim() === '' && !image) {
      return;
    }

    const refGroups = firebase.database().ref('groups').child(group.id);
    const refGroupMessages = refGroups.child('messages');
    const key = refGroupMessages.push().key;

    const messageData = {
      id: key,
      senderId: currentid,
      date: Date.now(),
    };

    if (msg.trim() !== '') {
      messageData.msg = msg;
    }

    if (image) {
      messageData.image = image;
    }

    refGroupMessages.child(key).set(messageData);

    setMsg('');
    setImage(null); 
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderId === currentid;
    const senderProfileImage = profiles[`profil${item.senderId}`]?.url;
  
    return (
      <View
        style={[
          styles.messageContainer,
          { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {!isCurrentUser && (
          <Image source={{ uri: senderProfileImage }} style={styles.senderProfileImage} />
        )}
        <View style={styles.messageContent}>
          {item.msg && <Text style={styles.messageText}>{item.msg}</Text>}
          {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
        </View>
        <Text style={styles.timeText}>{format(new Date(item.date), 'HH:mm')}</Text>
      </View>
    );
  };
  
  


  return (
    <View style={styles.container}>
          <ImageBackground
        source={require('../assets/backgound.png')}
        style={styles.background}
      >
        <View style={styles.chatHeader}>
          <IconButton
            icon="arrow-left"
            color="#fff"
            size={26}
            onPress={() => props.navigation.goBack()}
          />
          <Image source={{ uri: group.url }} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{group.groupName}</Text>
          </View>
       
        </View>
      <FlatList
     
      style={styles.scrollList}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
      />
  

      <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 8,
            backgroundColor: '#fff0',
            height: '10%',
            width: '100%',
            display: 'flex',
            paddingHorizontal:10,
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { borderColor: textInputFocus ? 'transparent' : 'transparent' },
              ]}
              value={msg}
              placeholder="write your message ..."
              onFocus={() => setTextInputFocus(true)}
              onBlur={() => setTextInputFocus(false)}
              onChangeText={(text) => setMsg(text)}
            />
            <IconButton
              icon="attachment"
              color="#fff"
              size={26}
              onPress={openAttachmentDialog}
            />
          </View>

          <Ionicons
  name="send-sharp"
  size={28}
  color={!msg && !image && !selectedLocation ? '#0C0908' : 'gray'}
  style={{ marginLeft: 5 }}
  onPress={() => sendMessage()}
/>





        </View>
        <Dialog visible={isAttachmentDialogVisible} onDismiss={closeAttachmentDialog}>
        <Dialog.Content style={{ padding: 20, alignItems: 'center' }}>
  <View style={{ flexDirection: 'row' }}>
    <View style={{marginRight:30}}>
      <IconButton
        icon={({ size, color }) => (
          <Ionicons name="camera" size={size} color={color} style={{ backgroundColor: '#DBCDF0', borderRadius: 50, paddingHorizontal: 10, paddingBottom:10, paddingTop:7}} />
        )}
        onPress={() => {
          closeAttachmentDialog();
          handleCameraPicker();
        }}
        style={{ borderRadius: 0, backgroundColor: 'transparent'}}
        color="white"
        size={30}
      />
      <Text style={{marginLeft:5}}>Camera</Text>
    </View>
    <View style={{marginRight:30}}>
      <IconButton
        icon={({ size, color }) => (
          <Ionicons name="image" size={size} color={color} style={{ backgroundColor: '#C6DEF1', borderRadius: 50, paddingHorizontal: 10, paddingBottom:10, paddingTop:7 }} />
        )}
        onPress={() => {
          closeAttachmentDialog();
          handleImagePicker();
        }}
        style={{ borderRadius: 50, backgroundColor: 'transparent' }}
        color="white"
        size={30}
      />
      <Text style={{marginLeft:10}}>Gallery</Text>
    </View>
  </View>
</Dialog.Content>


        </Dialog>



      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5326',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      height: 50,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 20,
    },
    input: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 8,
      paddingBottom: 8,
     
    },
    background: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1,
      height: "100%",
      width: "100%",
    },
    messageContainer: {
      backgroundColor: '#fff',
      paddingHorizontal:8,
      borderRadius: 8,
      marginTop: 15,
      maxWidth: '90%',
      alignSelf: 'flex-end',
      position: 'relative',
      minWidth:90,
      paddingBottom:10,
      marginBottom:20,
      marginLeft:20,
    },
    messageText: {
      color: '#000',
      fontSize: 16,
      marginBottom:20,
    },
    messageImage: {
      width: 200,
      height: 150,
      borderRadius: 8,
      marginTop: 5,
      marginBottom:20,
    },
    timeText: {
      position: 'absolute',
      bottom: 11,
      right: 8,
      color: 'gray',
    },
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
      width: '100%',
      height: 100,
      paddingTop: 40,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      position: 'absolute',
      top: 0,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 25,
      marginRight: 10,
    },
    nameContainer: {
      flex: 1,
      justifyContent: 'center',
      marginRight: 10,
    },
    name: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    scrollList: {
      flex: 1,
      width: '90%',
      marginTop: 100,
      paddingLeft:0,
    },
  
    icon: {
      marginRight: 10,
    },
    dateContainer: {
      alignItems: 'center',
      marginVertical: 8,
    },
    dateText: {
      color: 'gray',
      fontSize:16,
      marginBottom:10,
    },
    closeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
    emojiContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      marginTop: 10, // Adjust the margin as needed
    },
    emojiWrapper: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 8,
      marginBottom: 0,
    },
    emoji: {
      fontSize: 23,
    },
    selectedEmoji: {
      backgroundColor: 'white',
    },
    selectedEmojiContainer: {
      backgroundColor: 'white',
      borderRadius: 50,
      padding: 2,
      bottom: -20,
      alignSelf: 'flex-end',
      position:'absolute'
    },
    selectedEmojiText: {
      fontSize: 10,
    },
    senderProfileImage: {
      width: 20,
      height: 20,
      borderRadius: 25,
      top:-10,
      left:-20,
      position:'absolute',
    },
    
  });
  

export default GroupChat;
