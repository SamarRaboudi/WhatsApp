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
  Linking,
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

const Chat = (props) => {
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

  const currentid = props.route.params.currentid;
  const seconditem = props.route.params.seconditem;

  const emojiList = ['😊', '❤️', '😂', '😍', '👍', '🎉'];

  const openAttachmentDialog = () => {
    setAttachmentDialogVisible(true);
  };

  const closeAttachmentDialog = () => {
    setAttachmentDialogVisible(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const openLocationPicker = () => {
    props.navigation.navigate('LocationPickerScreen', {
      handleLocationSelect,
      currentid,
      seconditem,
    });
  };

  const handleLikeMessage = (messageId) => {
    const isLiked = likedMessages.includes(messageId);

    if (isLiked) {
      const updatedLikedMessages = likedMessages.filter((id) => id !== messageId);
      setLikedMessages(updatedLikedMessages);
    } else {
      setLikedMessages([...likedMessages, messageId]);
    }
  };

  const handleLongPress = (message) => {
    setPressedMessage(message);
    setEmojiDialogVisible(true);
    setSelectedEmoji(selectedEmojis[message.id] || null);
  };

  const handleEmojiPress = (messageId, emoji) => {
    setSelectedEmojis((prevSelectedEmojis) => ({
      ...prevSelectedEmojis,
      [pressedMessage.id]: emoji,
    }));

    storeEmojiInDatabase(messageId, emoji);

    setEmojiDialogVisible(false);
  };

  const storeEmojiInDatabase = (messageId, emoji) => {
    const ref_messages = firebase.database().ref('messages');
    const ref_room = ref_messages.child(`room_${currentid}_${seconditem.id}`);
    const ref_messages_room = ref_room.child('messages');
    const ref_selectedEmoji = ref_messages_room.child(`message${messageId}/emojis`);

    ref_selectedEmoji.set(emoji);
  };

  const renderEmojis = () => {
    return (
      <View style={styles.emojiContainer}>
        {emojiList.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => handleEmojiPress(pressedMessage.id, emoji)}
          >
            <View style={styles.emojiWrapper}>
              <Text
                style={[
                  styles.emoji,
                  selectedEmojis[pressedMessage.id] === emoji && styles.selectedEmoji,
                ]}
              >
                {emoji}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useEffect(() => {
    const ref_messages = firebase.database().ref('messages');

    const ref_room = ref_messages.child(`room_${currentid}_${seconditem.id}`);
    const ref_messages_room = ref_room.child('messages');

    const messagesList = ref_messages_room.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));

        setMessagesEnv(messagesArray);
      } else {
        setMessagesEnv([]);
      }
    });

    const ref_roomRec = ref_messages.child(`room_${seconditem.id}_${currentid}`);
    const ref_dist_writing = ref_roomRec.child('typing');
    ref_dist_writing.on('value', (snapshot) => {
      setWriting(snapshot.val());
    });

    const ref_messages_roomRec = ref_roomRec.child('messages');

    const messagesListRec = ref_messages_roomRec.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));
        setMessagesRec(messagesArray);
      } else {
        setMessagesRec([]);
      }
    });

    return () => {
      ref_room.off('value', messagesList);
      ref_roomRec.off('value', messagesListRec);
    };
  }, [currentid, seconditem]);

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

  return (
    <GestureHandlerRootView style={styles.container}>
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
          <Image source={{ uri: seconditem.url }} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{seconditem.firstName}</Text>
          </View>
          <IconButton
            icon="phone"
            color="#fff"
            size={24}
            onPress={() => {
              const phoneNumber = `tel:+216${seconditem.phone}`;
              Linking.openURL(phoneNumber);
            }}
          />
        </View>
        <GestureHandlerScrollView style={styles.scrollList}>
          {sortMsgs.map((message, index, array) => (
            <React.Fragment key={message.id}>
              {index === 0 || formatDate(array[index - 1].date) !== formatDate(message.date) ? (
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{formatDate(message.date)}</Text>
                </View>
              ) : null}
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  console.log("emojie is pressed");
                  if (nativeEvent.state === State.ACTIVE) {
                    setEmojiDialogVisible(true);
                    setSelectedEmoji(null);
                    setPressedMessage(message);
                  }
                }}
                minDurationMs={2000}
              >
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (message.image) {
                        setSelectedImage(message.image);
                        setIsImageViewerVisible(true);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.messageContainer,
                        {
                          alignSelf: message.senderId === currentid ? 'flex-end' : 'flex-start',
                          backgroundColor: message.senderId === currentid ? 'white' : '#D7E1F9',
                        },
                      ]}
                    >
                      {message.msg && !message.location && (
                        <Text style={styles.messageText}>{message.msg}</Text>
                      )}
                      {message.location && (
                        <MapView
                          style={{ width: 200, height: 150, borderRadius: 8, marginBottom: 20 }}
                          initialRegion={{
                            latitude: message.location.latitude,
                            longitude: message.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                          }}
                        >
                          <Marker
                            coordinate={{
                              latitude: message.location.latitude,
                              longitude: message.location.longitude,
                            }}
                          />
                        </MapView>
                      )}
                      {message.image && !selectedImage && (
                        <Image
                          source={{ uri: message.image }}
                          style={styles.messageImage}
                        />
                      )}
                      <Text style={styles.timeText}>{format(new Date(message.date), 'HH:mm')}</Text>
                      {message.emojis && (
                     <View style={styles.selectedEmojiContainer}>
                        <Text style={{ fontSize: 18 }}>{message.emojis}</Text>
                      </View>
                      )}
                    
                    </View>
                    
                  </TouchableOpacity>
                
                </View>
              </LongPressGestureHandler>
            </React.Fragment>
          ))}
        </GestureHandlerScrollView>

        {writing ? <Text>Writing...</Text> : <Text></Text>}

        <Dialog visible={isEmojiDialogVisible} onDismiss={() => setEmojiDialogVisible(false)}>
          <Dialog.Content>
            {pressedMessage && renderEmojis(pressedMessage)}
          </Dialog.Content>
        </Dialog>

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
              onChangeText={(text) => {
                setCouleurb('black');
                setCouleur('black');
                setMsg(text);
                const ref_messages = firebase.database().ref('messages');
                const ref_room = ref_messages.child(
                  `room_${currentid}_${seconditem.id}`
                );
                const ref_dist_writing = ref_room.child('typing');
                ref_dist_writing.set(text.length > 0);
              }}
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
  onPress={() => {
    console.log("msg:", msg);
    console.log("image:", image);
    console.log("selectedLocation:", selectedLocation);

    setDate(new Date());
    const ref_messages = firebase.database().ref('messages');
    const ref_room = ref_messages.child(
      `room_${currentid}_${seconditem.id}`
    );
    const ref_messages_room = ref_room.child('messages');
    const key = ref_messages_room.push().key;
    const ref_unmessage = ref_messages_room.child(`message${key}`);

    // Check if there is a selected location
    if (selectedLocation) {
      // Customize the message for the location
      const locationMessage = `Location: (${selectedLocation.latitude}, ${selectedLocation.longitude})`;
      ref_unmessage.set({
        id: key,
        msg: msg,
        image: image,
        location: selectedLocation,
        date: Date.now(),
        senderId: currentid,
        //emojis: selectedEmojis[key],
      });
    } else {
      ref_unmessage.set({
        id: key,
        msg: msg,
        image: image,
        location: null,
        date: Date.now(),
        senderId: currentid,
      });
    }

    const ref_dist_writing = ref_room.child('typing');
    ref_dist_writing.set(false);
    setMsg('');
    setImage(null);
    setSelectedLocation(null); 
    setCouleurb('#0005');
  }}
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
    <View>
      <IconButton
        icon={({ size, color }) => (
          <Ionicons
            name="location"
            size={size}
            color={color}
            style={{ backgroundColor: '#A3D7A3', borderRadius: 50, paddingHorizontal: 10, paddingBottom: 10, paddingTop: 7 }}
          />
        )}
        onPress={() => {
          closeAttachmentDialog();
          openLocationPicker();
        }}
        style={{ borderRadius: 50, backgroundColor: 'transparent' }}
        color="white"
        size={30}
      />
      <Text style={{ marginLeft: 10 }}>Location</Text>
    </View>
  </View>
</Dialog.Content>


        </Dialog>

        {selectedImage && (
          <ImageViewer
            visible={isImageViewerVisible}
            imageUri={selectedImage}
            onClose={() => {
              setIsImageViewerVisible(false);
              setSelectedImage(null);
            }}
          />
        )}
      </ImageBackground>
    </GestureHandlerRootView>
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
});

export default Chat;