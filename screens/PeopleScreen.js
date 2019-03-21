import React, { Component } from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import {
  Alert,
  AsyncStorage,
  BackHandler,
  FlatList,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { Root, Toast } from "native-base";
import { Constants } from "expo";

class ListPersonScreen extends Component {
  constructor(inProps) {
    super(inProps);
    this.state = { listData: [] };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => { return true; });
    AsyncStorage.getItem("people",
      function (inError, inPeople) {
        if (inPeople === null) {
          inPeople = [];
        } else {
          inPeople = JSON.parse(inPeople);
        }
        this.setState({ listData: inPeople }, () => console.log(this.state));
      }.bind(this)
    );
  };


  render() {
    return (
      <Root>
        <View style={styles.listScreenContainer}>
          <CustomButton
            text="Add Person"
            width="94%"
            onPress={() => { this.props.navigation.navigate("AddPersonScreen"); }}
          />
          <FlatList
            style={styles.peopleList}
            data={this.state.listData}
            renderItem={({ item }) =>
              <View style={styles.personContainer}>
                <Text style={styles.personName}>{item.name}</Text>
                <CustomButton text="Delete"
                  onPress={() => {
                    Alert.alert("Please confirm",
                      "Are you sure you want to delete this person?",
                      [
                        {
                          text: "Yes", onPress: () => {
                            AsyncStorage.getItem("people",
                              function (inError, inPeople) {
                                if (inPeople === null) {
                                  inPeople = [];
                                } else {
                                  inPeople = JSON.parse(inPeople);
                                }
                                for (let i = 0; i < inPeople.length; i++) {
                                  const person = inPeople[i];
                                  if (person.key === item.key) {
                                    inPeople.splice(i, 1);
                                    break;
                                  }
                                }
                                AsyncStorage.setItem("people",
                                  JSON.stringify(inPeople), function () {
                                    this.setState({ listData: inPeople });
                                    Toast.show({
                                      text: "Person deleted",
                                      position: "bottom", type: "danger",
                                      duration: 2000
                                    });
                                  }.bind(this)
                                );
                              }.bind(this)
                            );
                          }
                        },
                        { text: "No" },
                        { text: "Cancel", style: "cancel" }
                      ],
                      { cancelable: true }
                    )
                  }} />
              </View>
            }
          />
        </View>
      </Root>
    );
  }
}

class AddPersonScreen extends Component {
  constructor(inProps) {
    super(inProps);
    this.state = {
      name: "",
      status: "",
      key: `r_${new Date().getTime()}`
    };
  }

  render() {
    return (
      <ScrollView style={styles.addScreenContainer}>
        <View style={styles.addScreenInnerContainer}>
          <View style={styles.addScreenFormContainer}>
            <CustomTextInput label="Name" maxLength={20}
              stateHolder={this} stateFieldName="name" />
            <Text style={styles.fieldLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                prompt="Status"
                selectedValue={this.state.status}
                onValueChange={(inItemValue) => this.setState({ status: inItemValue })}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Child" value="Child" />
                <Picker.Item label="Teen" value="Teen" />
                <Picker.Item label="Adult" value="Adult" />
              </Picker>
            </View>
          </View>
          <View style={styles.addScreenButtonsContainer}>
            <CustomButton text="Cancel" width="44%"
              onPress={() => { this.props.navigation.navigate("ListPersonScreen"); }} />
            <CustomButton text="Save" width="44%"
              onPress={() => {
                AsyncStorage.getItem("people",
                  function (inError, inPeople) {
                    if (inPeople === null) {
                      inPeople = [];
                    } else {
                      inPeople = JSON.parse(inPeople);
                    }
                    inPeople.push(this.state);
                    AsyncStorage.setItem("people",
                      JSON.stringify(inPeople), function () {
                        this.props.navigation.navigate("ListPersonScreen");
                      }.bind(this)
                    );
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
  listScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { paddingTop: Constants.statusBarHeight },
      android: {}
    })
  },
  peopleList: { width: "94%" },
  personContainer: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    borderColor: "#e0e0e0",
    borderBottomWidth: 2,
    alignItems: "center"
  },
  personName: { flex: 1 },
  addScreenContainer: { marginTop: Constants.statusBarHeight },
  addScreenInnerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    width: "100%"
  },
  addScreenFormContainer: { width: "96%" },
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


const PeopleScreen = createStackNavigator(
  {
    ListPersonScreen: {
      screen: ListPersonScreen
    },
    AddPersonScreen: {
      screen: AddPersonScreen
    }
  },
  {
    headerMode: "none",
    initialRouteName: "ListPersonScreen"
  }
);

export default PeopleScreen;