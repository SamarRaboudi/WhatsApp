import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ImageViewer = ({ visible, imageUri, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} onDismiss={onClose}>
      <View style={styles.container}>
        <TouchableOpacity  onPress={onClose}>
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    paddingHorizontal:10,
    paddingTop:30,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
