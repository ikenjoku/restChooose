import React from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';


export default class DecisionScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Decision Screen</Text>
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
