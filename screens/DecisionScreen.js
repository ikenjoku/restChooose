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

class PreFiltersScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = {
      cuisine: "",
      price: "",
      rating: "",
      delivery: ""
    };
  }

  render() {
    return (
      <ScrollView style={styles.preFiltersContainer}>
        <View style={styles.preFiltersInnerContainer}>
          <View style={styles.preFiltersScreenFormContainer}>
            <View style={styles.preFiltersHeadlineContainer}>
              <Text style={styles.preFiltersHeadline}>Pre-Filters</Text>
            </View>
            <Text style={styles.fieldLabel}>Cuisine</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.cuisine}
                prompt="Cuisine"
                onValueChange={(inItemValue) => this.setState({ cuisine: inItemValue })}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Algerian" value="Algerian" />
                <Picker.Item label="American" value="American" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            <Text style={styles.fieldLabel}>Price</Text>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker} selectedValue={this.state.price}
                prompt="Price"
                onValueChange={(inItemValue) => this.setState({ price: inItemValue })}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
              </Picker>
            </View>
            <Text style={styles.fieldLabel}>Rating</Text>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker} selectedValue={this.state.rating}
                prompt="Rating"
                onValueChange={(inItemValue) => this.setState({ rating: inItemValue })}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
              </Picker>
            </View>
            <Text style={styles.fieldLabel}>Delivery?</Text>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker} prompt="Delivery?"
                selectedValue={this.state.delivery}
                onValueChange={(inItemValue) => this.setState({ delivery: inItemValue })}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
          </View>
          <View style={styles.addScreenButtonsContainer}>
            <CustomButton
              text="Next"
              width="94%"
              onPress={() => {
                AsyncStorage.getItem("restaurants",
                  function (inError, inRestaurants) {
                    if (inRestaurants === null) {
                      inRestaurants = [];
                    } else {
                      inRestaurants = JSON.parse(inRestaurants);
                    }
                    filteredRestaurants = [];
                    for (const restaurant of inRestaurants) {
                      let passTests = true;
                      if (this.state.cuisine !== "") {
                        if (Object.keys(this.state.cuisine).length > 0) {
                          if (restaurant.cuisine !== this.state.cuisine) {
                            passTests = false;
                          }
                        }
                      }
                      if (this.state.price !== "") {
                        if (restaurant.price > this.state.price) { passTests = false; }
                      }
                      if (this.state.rating !== "") {
                        if (restaurant.rating < this.state.rating) {
                          passTests = false;
                        }
                      }
                      if (this.state.delivery !== "") {
                        if (restaurant.delivery !== this.state.delivery) {
                          passTests = false;
                        }
                      }
                      if (this.state.cuisine.length === 0 && this.state.price
                        === "" &&
                        this.state.rating === "" && this.state.delivery === "") {
                          passTests = true;
                      }
                      if (passTests) { filteredRestaurants.push(restaurant); }
                    }
                    if (filteredRestaurants.length === 0) {
                      Alert.alert("Well, that's an easy choice",
                        "None of your restaurants match these criteria. Maybe " + "try loosening them up a bit?",
                        [{ text: "OK" }], { cancelable: false }
                      );
                    } else {
                      this.props.navigation.navigate("ChoiceScreen");
                    }
                  }.bind(this)
                );
              }} />
          </View>
        </View>
      </ScrollView>
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
  preFiltersContainer: { marginTop: Constants.statusBarHeight },
  preFiltersInnerContainer: {
    flex: 1, alignItems: "center", paddingTop:
      20, width: "100%"
  },
  preFiltersScreenFormContainer: { width: "96%" },
  preFiltersHeadlineContainer: {
    flex: 1, alignItems: "center",
    justifyContent: "center"
  },
preFiltersHeadline: { fontSize: 30, marginTop: 20, marginBottom: 20 },
  fieldLabel: { marginLeft: 10 },
  pickerContainer: {
    ...Platform.select({
      ios: {},
      android: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4
      }
    })
  },
  picker: {
    ...Platform.select({
      ios: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4
      },
      android: {}
    })
  },
  addScreenButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },

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