import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";

import Welcome from "../components/Welcome";
import Register from "../components/Register";
import Login from "../components/Login";
import Home from "../components/Home";
import Users from "../components/Users";
import Profile from "../components/Profile";
import League from "../components/League";
import Match from "../components/Match";
import Record from "../components/Record";
import { Platform } from "react-native";
// import League2 from "../components/league2";

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: <Icon name="ios-home" type="ionicon" color="white" />,
      },
    },
    Liga: {
      screen: League,
      navigationOptions: {
        tabBarIcon: <Icon name="ios-people" type="ionicon" color="white" />,
      },
    },
    Jugar: {
      screen: Match,
      navigationOptions: {
        tabBarIcon: (
          <Icon name="ios-add-circle-outline" type="ionicon" color="white" />
        ),
      },
    },
    Historial: {
      screen: Record,
      navigationOptions: {
        tabBarIcon: <Icon name="history" color="white" />,
      },
    },
    Perfil: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: <Icon name="ios-person" type="ionicon" color="white" />,
      },
    },
    
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "#090717",
        ...Platform.select({
          ios: {
            height: 50,
            marginBottom: -30,
          },
        }),
      },
    },
  }
);

const AuthNavigator = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: () => ({
      headerShown: false,
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: () => ({
      headerShown: false,
    }),
  },
  Register: {
    screen: Register,
    navigationOptions: () => ({
      headerShown: false,
    }),
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: Welcome,
      Auth: AuthNavigator,
      App: AppNavigator,
    },
    {
      initialRouteName: "AuthLoading",
      /* initialRouteName: 'Auth', */
/*        initialRouteName: 'App', */
    },
    {
      defaultNavigationOptions: {
        headerTintColor: "white",
      },
    }
  )
);
