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



class WhosGoingScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = { people: [], selected: {} };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => { return true; }); AsyncStorage.getItem("people",
      function (inError, inPeople) {
        if (inPeople === null) {
          inPeople = [];
        } else {
          inPeople = JSON.parse(inPeople);
        }
        const selected = {};
        for (const person of inPeople) { selected[person.key] = false; }
        this.setState({ people: inPeople, selected: selected });
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={styles.listScreenContainer}>
        <Text style={styles.whosGoingHeadline}>Who's Going?</Text>
        <FlatList
          style={{ width: "94%" }}
          data={this.state.people}
          renderItem={({ item }) =>
            <TouchableOpacity
              style={styles.whosGoingItemTouchable}
              onPress={function () {
                const selected = this.state.selected;
                selected[item.key] = !selected[item.key];
                this.setState({ selected: selected });
              }.bind(this)}
            >
              <CheckBox style={styles.whosGoingCheckbox}
                checked={this.state.selected[item.key]}
                onPress={function () {
                  const selected = this.state.selected;
                  selected[item.key] = !selected[item.key];
                  this.setState({ selected: selected });
                }.bind(this)} />
              <Text style={styles.whosGoingName}>
                {item.firstName} {item.lastName} ({item.relationship})
            </Text>
            </TouchableOpacity>
          }
        />
        <CustomButton text="Next" width="94%"
          onPress={() => {
            participants = [];
            for (const person of this.state.people) {
              if (this.state.selected[person.key]) {
                const participant = Object.assign({}, person);
                participant.vetoed = "no";
                participants.push(participant);
              }
            }
            if (participants.length === 0) {
              Alert.alert("Uhh, you awake?",
                "You didn't select anyone to go. Wanna give it another try?",
                [{ text: "OK" }], { cancelable: false }
              );
            } else {
              this.props.navigation.navigate("PreFiltersScreen");
            }
          }}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  decisionTimeScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  decisionTimeScreenTouchable: {
    alignItems: "center",
    justifyContent: "center"
  },
  listScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { paddingTop: Constants.statusBarHeight },
      android: {}
    })
  },
  whosGoingHeadline: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20
  },
  whosGoingItemTouchable: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10
  },
  whosGoingCheckbox: { marginRight: 20 },
  whosGoingName: { flex: 1 },

});


const DecisionScreen = createStackNavigator(
  {
    ListScreen: {
      screen: DecisionTimeScreen
    },
    WhosGoingScreen: {
      screen: WhosGoingScreen
    }
  },
  {
    headerMode: "none",
    initialRouteName: "ListScreen"
  }
);

export default DecisionScreen;