import React from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import { Alert, AsyncStorage, BackHandler, FlatList, Picker, Platform,
ScrollView,
  StyleSheet, Text, View
} from "react-native";
import { StackNavigator } from "react-navigation";
import { Root, Toast } from "native-base";
import { Constants } from "expo";


export default class RestaurantScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Restaurants Screen</Text>
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
