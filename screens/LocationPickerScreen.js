import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationPickerScreen = ({ route, navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { currentid, seconditem, handleLocationSelect } = route.params;

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleConfirmLocation = () => {
    console.log('Selected Location Coordinates:', selectedLocation);
    // Pass the selected location back to the chat screen
    handleLocationSelect(selectedLocation);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmLocation}
      >
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LocationPickerScreen;
