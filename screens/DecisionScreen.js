import React from "react";
import CustomButton from "../components/CustomButton";
import {
  Alert, AsyncStorage, BackHandler, Button, FlatList, Image, Modal,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { CheckBox } from "native-base";
import { Constants } from "expo";

let participants = null;
let filteredRestaurants = null;
let chosenRestaurant = {};

const getRandom = (inMin, inMax) => {
  inMin = Math.ceil(inMin);
  inMax = Math.floor(inMax);
  return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};

class DecisionTimeScreen extends React.Component {
  render() {
    return (
      <View style={styles.decisionTimeScreenContainer}>
        <TouchableOpacity style={styles.decisionTimeScreenTouchable}
          onPress={() => {
            AsyncStorage.getItem("people",
              function (inError, inPeople) {
                if (inPeople === null) {
                  inPeople = [];
                } else {
                  inPeople = JSON.parse(inPeople);
                }
                if (inPeople.length === 0) {
                  Alert.alert("That ain't gonna work, chief",
                    "You haven't added any people. " +
                    "You should probably do that first, no?",
                    [{ text: "OK" }], { cancelable: false }
                  );
                } else {
                  AsyncStorage.getItem("restaurants",
                    function (inError, inRestaurants) {
                      if (inRestaurants === null) {
                        inRestaurants = [];
                      } else {
                        inRestaurants = JSON.parse(inRestaurants);
                      }
                      if (inRestaurants.length === 0) {
                        Alert.alert("That ain't gonna work, chief",
                          "You haven't added any restaurants. " +
                          "You should probably do that first, no?",
                          [{ text: "OK" }], { cancelable: false }
                        );
                      } else {
                        this.props.navigation.navigate("WhosGoingScreen");
                      }
                    }.bind(this)
                  );
                }
              }.bind(this)
            );
          }} >
          <Image source={require("../assets/icon-people.png")} />
          <Text style={{ paddingTop: 20 }}>(click the food to get going)</Text>
        </TouchableOpacity>
      </View>);
  }
}

const styles = StyleSheet.create({
  decisionTimeScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  decisionTimeScreenTouchable : { alignItems : "center", justifyContent : "center" }

});


const DecisionScreen = createStackNavigator(
  {
    ListScreen: {
      screen: DecisionTimeScreen
    }
  },
  {
    headerMode: "none",
    initialRouteName: "ListScreen"
  }
);

export default DecisionScreen;