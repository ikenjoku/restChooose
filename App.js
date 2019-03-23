import React from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import { Constants } from "expo";
import { TabNavigator, createStackNavigator, createBottomTabNavigator } from "react-navigation";
import PeopleScreen from './screens/PeopleScreen';
import DecisionScreen from './screens/DecisionScreen';
import RestaurantsScreen from './screens/RestaurantScreen';


const platformOS = Platform.OS.toLowerCase();


const TabStack = createBottomTabNavigator({
  PeopleScreen: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarLabel: "People",
      tabBarIcon: ({ tintColor }) => (
        <Image source={require("./assets/icon-people.png")}
          style={{ width: 32, height: 32, tintColor: tintColor }} />
      )
    }
  },
  DecisionScreen: {
    screen: DecisionScreen,
    navigationOptions: {
      tabBarLabel: "Decision",
      tabBarIcon: ({ tintColor }) => (
        <Image source={require("./assets/icon-decision.png")}
          style={{ width: 32, height: 32, tintColor: tintColor }} />
      )
    }
  },
  RestaurantsScreen: {
    screen: RestaurantsScreen,
    navigationOptions: {
      tabBarLabel: "Restaurants",
      tabBarIcon: ({ tintColor }) => (
        <Image source={require("./assets/icon-restaurants.png")}
          style={{ width: 32, height: 32, tintColor: tintColor }} />
      )
    }
  }
}, {
    initialRouteName: "DecisionScreen",
    animationEnabled: true,
    swipeEnabled: true,
    backBehavior: "none", lazy: true,
    tabBarPosition: platformOS === "android" ? "top" : "bottom",
    tabBarOptions: {
      activeTintColor: "#ff0000",
      showIcon: false,
      style: {
        paddingTop: platformOS === "android" ? Constants.statusBarHeight : 0
      }
    }
  });

const RootStack = createStackNavigator({
  Home: TabStack
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

