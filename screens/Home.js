import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StyleSheet } from 'react-native';
import List_Profils from '../HomeScreens/List_Profils';
import Groupe from '../HomeScreens/Groupe';
import MyAccount from '../HomeScreens/MyAccount';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      barStyle={styles.tabBar}
      activeColor={styles.activeColor.color}
      inactiveColor={styles.inactiveColor.color}
    >
      <Tab.Screen
        name="Profils"
        component={List_Profils}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="people" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={Groupe}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="ios-chatbubbles" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Account"
        component={MyAccount}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
  },
  activeColor: {
    color: '#000',
  },
  inactiveColor: {
    color: '#aaa',
  },
});
