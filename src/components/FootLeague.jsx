
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { leagueStyles } from "../styles/league";
import axios from "axios";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { addUserToLeague } from "../state/memberList";
import { setUserLeagues } from "../state/userLeague";
import { setLeagueId } from "../state/idLeague";
import { reload } from "../state/reload";
const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

const FootLigue = ({ leagueId, user }) => {
   const dispatch = useDispatch()
   // const members = useSelector((state) => state.members)
   const userData = useSelector(state => state.user)

   // if (!userData.rank) return <></>

/*    const [buttonValue, setButtonValue] = useState(false) */

   // let member = members?.filter( (member) => member?.nickname == userData.nickname)


   const buttonHandler = () => {
      axios
      .put(`${uri}/api/league/${leagueId}/addUser/${userData._id}`)
      .then( () => {
         // dispatch(setUserLeagues(userData._id))
         dispatch(setLeagueId(leagueId));
      })
   }
   
   // async () => {
   //    try {
   //       // const userString = await AsyncStorage.getItem("userInfo")
            
   //       // const result = await axios
   //       // .post(`${uri}/api/user/me`, {}, 
   //       //       { headers: { Authorization: `Bearer ${userString}` } } )

   //       const res = await dispatch(addUserToLeague({ligueId: ligueId, userData: userData}))
   //       await dispatch(setUserLeagues({userId: userData._id}))
   //       // setButtonValue(true)
   //    } catch (err) { console.log(err); }
   // }

   // useEffect(()=>{
   //    member = members?.filter( (member) => member?.nickname == userData.nickname)
   // }, [dispatch])

   return ( <>
      { /*member[0] /* && buttonValue */ false && userData.leagues.includes(leagueId) ?
           ( userData.rank > 8 
            ? <View style={leagueStyles.foot}>
               <View style={leagueStyles.user}>
                  <View style={leagueStyles.rank}>
                     <Text style={{color: '#FFFFFF'}}>{user.rank}</Text>
                  </View>
                  <View style={[leagueStyles.img, {backgroundColor: user.color}]}>
                  </View>
                  <View style={leagueStyles.nick}>
                     <Text style={{color: '#FFFFFF'}}>{user.nickname}</Text>
                  </View>
                  <View style={leagueStyles.elo}>
                     <Text style={{color: '#FFFFFF'}}>{user.elo}</Text>
                  </View> 
               </View>
            </View>
            :  <></> )
         : <View style={[leagueStyles.foot, { height: 100 }]}>
            <TouchableOpacity style={[leagueStyles.join, {backgroundColor:"#16a085"}]}
               onPress={buttonHandler}>
               <Text style={leagueStyles.joinTxt}>Unirse</Text>
            </TouchableOpacity> 
         </View>}
      </>
)}

export default FootLigue;