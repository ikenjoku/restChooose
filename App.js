import React from 'react';
import { StyleSheet, Text, View,  Platform, Image } from 'react-native';
import { Constants } from "expo";
import PeopleScreen from './screens/PeopleScreen';
import DecisionScreen from './screens/DecisionScreen';
import RestaurantScreen from './screens/RestaurantScreen';


export default class App extends React.Component {
  render() {
    const platform = Platform.OS.toUpperCase();
    return (
      <View style={styles.container}>
        <Text>Where to eat running on {platform}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
