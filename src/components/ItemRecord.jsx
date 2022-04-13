import axios from "axios";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setMatch } from "../state/record";
import { colorSet } from "../styles/colorSet";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { cardStyles, itemStyles, record2Styles, recordStyles } from "../styles/record";

const ItemRecord = ({ item }) => {
   const { manifest } = Constants;
   const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

   let [showInfo, setShowInfo] = useState(false)
   const [isAccepted, setIsAccepted] = useState(false);
   const [result1, setResult1] = useState(0);
   const [result2, setResult2] = useState(0);
   const [userString, setUserString] = useState("")

   const [isScored, setIsScored] = useState(false)

   const [customStatus, setCustomStatus] = useState(item.status)
   const [score, setScore] = useState([0, 0])

   const match = useSelector((state) => state.match);
   const user = useSelector((state) => state.user);
 
 
   useEffect(() => {
      const asyncUser = async () => {
         const result = await AsyncStorage.getItem("userInfo");
         setUserString(result)
      }

      asyncUser()

      if (customStatus === "completada") {
         axios
         .get(`${uri}/api/result/getResultByMatchId/${item._id}`)
         .then(({ data }) => {
            if (item.team_1.filter(element => element._id === user._id).length === 1){
                  setIsScored(data.confirmation_1)
            }
            else {
               setIsScored(data.confirmation_2)
            }
         })
      }
      if (customStatus === "confirmada") {
         axios
         .get(`${uri}/api/result/getResultByMatchId/${item._id}`)
         .then(({ data }) => {
            let result = data.score_1.split("-")
            if (item.team_1.filter(element => element._id === user._id).length === 1){
                  setScore([result[0], result[1]])
                  setCustomStatus(result[0] > result[1] ? "win" : "lost")
            }
            else {
               setScore([result[1], result[0]])
               setCustomStatus(result[1] > result[0] ? "win" : "lost")
            }
         })
      }
      
      if (customStatus === "lista" && moment().isSameOrAfter(moment(`${item.date} ${item.time}`, "DD-MM-YYYY H:mm"))) {
         setCustomStatus("completada")
      }


      if (customStatus === "pendiente") {
         const equipos = item.invitations_team1.concat(item.invitations_team2);
         const arrayInvit = equipos.filter(
            (invitation) => invitation.toId === user._id
         );
         if (!arrayInvit[0]) return;
         if (arrayInvit[0].status === "accepted") setIsAccepted(true);
      }
    
   }, [item]);
 
   const acceptHandler = () => {
     axios
      .put(`${uri}/api/invitation/invitAcepted/${item._id}/user/${user._id}`, {}, {headers: {Authorization: `Bearer ${userString}`,},})
      .then(({ data }) => {
         item = data  
         setIsAccepted(true)
      });
   };

   const resultHandler = () => {
      axios
      .put(`${uri}/api/result/updateResult/match/${item._id}/user/${user._id}`, {score: `${result1}-${result2}`}, {headers: {Authorization: `Bearer ${userString}`,},})
      .then(({ data }) => {
         item = data
      });
   };

   const cancelHandler = () => {
      axios
      .put(`${uri}/api/invitation/invitRejected/${item._id}/user/${user._id}`, {}, {headers: {Authorization: `Bearer ${userString}`,},})
      .then(({ data }) => {
         setCustomStatus("cancelada")
      });
      
   }


   return (
      <TouchableOpacity onPress={() => setShowInfo(!showInfo)} 
                        style={[itemStyles.item, {borderColor: colorSet[customStatus] , borderWidth:1.5}]}>
         <View style={[itemStyles.head]}>
            <View style={[itemStyles.team, {borderColor: "blue" , borderWidth:0}]}>
               {item[item.team_1.filter(element => element._id === user._id).length === 1 ? "team_1" : "team_2"]
               .slice(0,3).map( (user, i) => {
                  return (
                     <Text style={[itemStyles.text, {marginBottom: 3}]} key= {i}>
                        {item.team_1.length > 3 && i === 2 
                        ? `y ${item.team_1.length-2} mas` 
                        : user.nickname }
                     </Text>)
                  })}
            </View>
            
            <View style={[itemStyles.info, {borderColor: "red" , borderWidth:0}]}>
               
                  {customStatus === "win" || customStatus === "lost"
                  ?<Text style={[itemStyles.text, { fontSize: 30, color: colorSet[customStatus] }]}> 
                     {`${score[0]} - ${score[1]}`}
                  </Text>
                  :<>
                     <Text style={[itemStyles.text, { textTransform: "uppercase", color: colorSet[customStatus] }]}>
                        {customStatus === "completada" ? "completa" : customStatus}
                     </Text>
                     <Text style={[itemStyles.text, { textTransform: "uppercase", color: colorSet[customStatus] }]}>
                        {moment(item.date, "DD-MM-YYYY").format("DD-MM")}
                     </Text>
                  </>
                  }
            
               
            </View>

            <View style={[itemStyles.team, {borderColor: "blue" , borderWidth:0}]}>
               {item[item.team_1.filter(element => element._id === user._id).length === 1 ? "team_2" : "team_1"]
               .slice(0,3).map( (user, i) => {
                  return (
                     <Text style={[itemStyles.text, {marginBottom: 3}]} key= {i}>
                        {item.team_2.length > 3 && i === 2 
                        ? `y ${item.team_2.length-2} mas` 
                        : user.nickname }
                     </Text>)
                  })}
            </View>
         </View>
         
         { showInfo
         ? <View>
            <View style={{marginBottom: customStatus === "completada" || customStatus === "pendiente"? 0 : 16}}>
               <Text style={[itemStyles.text]}>
                  El partido se { customStatus === "pendiente" || customStatus === "lista" ? "disputara" : "disputo"} a las {item.time}
               </Text>
               {item.invitationText === ""
               ? <></>
               : <Text style={[itemStyles.text]}>
                     {item.invitationText}
               </Text>}
            </View>

               { (customStatus === "pendiente") 
               ?<View>
                  {!isAccepted
                  ? <View style={{ marginTop: 30}}>
                        <TouchableOpacity style={[cardStyles.confirmButton, { backgroundColor: colorSet[customStatus]}]}
                                       onPress={acceptHandler}>
                           <Text style={[cardStyles.buttonTxt]}>{"Participar"}</Text>
                        </TouchableOpacity>
                        
                        <View style={{ marginVertical: 10, flexDirection: "row"}}>
                           <TouchableOpacity style={[cardStyles.cancelButton]} onPress={cancelHandler}>
                              <Text style={[cardStyles.cancelTxt, {color: colorSet.error}]}>{"Cancelar"}</Text>
                           </TouchableOpacity>
                        </View>
                  </View>
                  : <View>
                        <Text style={[itemStyles.text, {marginTop: 10}]}>
                           Ya has confirmado tu participación
                        </Text>
                        <View style={{ marginVertical: 10, flexDirection: "row"}}>
                           <TouchableOpacity style={[cardStyles.cancelButton]} onPress={cancelHandler}>
                              <Text style={[cardStyles.cancelTxt, {color: colorSet.error}]}>{"Cancelar"}</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  }
               </View>
               :<></> 
               }

               { (customStatus === "lista") 
               ?<View>
                  <Text style={[itemStyles.text, {marginTop: 10}]}>
                     Ya has confirmado tu participación
                  </Text>
                  <View style={{ marginVertical: 10, flexDirection: "row"}}>
                  <TouchableOpacity style={[cardStyles.cancelButton]} onPress={cancelHandler}>
                     <Text style={[cardStyles.cancelTxt, {color: colorSet.error}]}>{"Cancelar"}</Text>
                  </TouchableOpacity>
                  </View>
               </View>
               :<></> 
               }

               { (customStatus === "completada") 
               ?<View>
                  { !isScored 
                  ? <View style={{ marginTop: 30, flexDirection: "row"}}>

                     <TextInput style={[cardStyles.input, {height: 40, alignSelf: "center"}]}
                                    name="text" keyboardType="default"
                                    placeholder="Resultado"
                                    value={result1} 
                                    onChangeText={ text => setResult1(parseInt(text))}
                     />
                     
                     <TouchableOpacity style={[cardStyles.confirmButton, { backgroundColor: colorSet[customStatus]}]}
                                       onPress={resultHandler}>
                        <Text style={[cardStyles.buttonTxt]}>{"Enviar"}</Text>
                     </TouchableOpacity>

                     <TextInput style={[cardStyles.input, {height: 40, alignSelf: "center"}]}
                                    name="text" keyboardType="default"
                                    placeholder="Resultado"
                                    value={result2} 
                                    onChangeText={ text => setResult2(parseInt(text))}
                     />
                  </View>
                  :<></>}
                  <View style={{ marginVertical: 10, flexDirection: "row"}}>
                  <TouchableOpacity style={[cardStyles.cancelButton]} onPress={cancelHandler}>
                     <Text style={[cardStyles.cancelTxt, {color: colorSet.error}]}>{"Cancelar"}</Text>
                  </TouchableOpacity>
                  </View>
               </View>
               :<></> 
               }
         </View>
         :<></> 
         }
         
         
      </TouchableOpacity> 
  );
};

export default ItemRecord;
