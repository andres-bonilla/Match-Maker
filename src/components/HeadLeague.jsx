import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Constants from "expo-constants";
import {Picker} from '@react-native-picker/picker'

import AsyncStorage from "@react-native-async-storage/async-storage";
import { leagueStyles } from "../styles/league";
import { NavigationRouteContext } from "@react-navigation/native";

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

const HeadLeague = ({screen, leagueId, userData, navi}) => {
   let [leagueList, setLeagueList] = useState([])

   const [selectedValue, setSelectedValue] = useState( leagueId || null);

   useEffect(()=>{
      if (userData.id){
         axios
         .get(`${uri}/api/user/getLeagues/${userData.id}`)
         .then( ({data}) => {
            setLeagueList(data)
         })
      }

   }, [])

   const changeHandler = (itemValue) => {
      axios
      .get(`${uri}/api/league/showLeague/${itemValue}`)
      .then( ({ data }) => {
         navi()
      })
   }

   return (
      <View style={leagueStyles.head}>
            <View style={leagueStyles.menu}>
               <Picker
                  selectedValue={selectedValue}
                  style={{ height: 50, width: "auto", color: '#FFFFFF'}}
                  itemStyle={{ height: 50 }}
                  onValueChange={(itemValue, itemIndex) => {
                     changeHandler(itemValue)
                     console.log("pickerValue:  ", itemValue)//anular el texto
                     setSelectedValue(null)
                  }}
               >
                  <Picker.Item label="Liga de Ping Pong" value="liga"/>
                  {leagueList.map( (element, i) => 
                     <Picker.Item label={element.name} value={element._id} key= {i}/> )}
               </Picker>
            </View>
            
            <View style={leagueStyles.info}>
               <Text style={leagueStyles.title}>{selectedValue}</Text>
            </View>
         </View>
)}

export default HeadLeague;