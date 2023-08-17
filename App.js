
import axios from "axios";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
/* const { manifest } = Constants; */
import { View, Text, SafeAreaView, LogBox } from 'react-native'
import * as React from 'react';
import RootNavigation from "./src/navigation/rootNavigation";
import { StatusBar } from "expo-status-bar";
import { Provider } from 'react-redux'
import store from './src/state/store';


function App() {
  LogBox.ignoreAllLogs()
  return (
    <Provider store={store}>
    <SafeAreaView style={{flex : 1, backgroundColor: "#0e0b29"}}>
    <StatusBar style="light" />
      <RootNavigation/>
    </SafeAreaView>

    </Provider>
  );
}

export default App;