import axios from "axios";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setMatch } from "../state/record";
import { colorSet } from "../styles/colorSet";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { cardStyles, itemStyles} from "../styles/record";


const ItemRecord = ({ item, setOpenedMatch, openedMatch }) => {
   const { manifest } = Constants;
   const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

   let [showInfo, setShowInfo] = useState(false)
   const [isAccepted, setIsAccepted] = useState(false);
   const [result1, setResult1] = useState(0);
   const [result2, setResult2] = useState(0);
   const [userString, setUserString] = useState("")

   const [isScored, setIsScored] = useState(false)

   //const [item.status, setitem.status] = useState(item.status)
   const [score, setScore] = useState([0, 0])

   const match = useSelector((state) => state.match);
   const user = useSelector((state) => state.user);
 
 
   useEffect(() => {
      const asyncUser = async () => {
         const result = await AsyncStorage.getItem("userInfo");
         setUserString(result)
      }

      asyncUser()

      // if(item.status==="conflicto") {
      //    item.status="completada"
      // }

      if (item.status === "completada") {
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
      if (item.status === "confirmada") {
         axios
         .get(`${uri}/api/result/getResultByMatchId/${item._id}`)
         .then(({ data }) => {
            let result = data.score_1.split("-")
            if (item.team_1.filter(element => element._id === user._id).length === 1){
                  setScore([result[0], result[1]])
                  //item.status = result[0] > result[1] ? "win" : "lost"
            }
            else {
               setScore([result[1], result[0]])
               //item.status = result[1] > result[0] ? "win" : "lost"
            }
         })
      }
      
      // if (item.status === "lista" && moment().isSameOrAfter(moment(`${item.date} ${item.time}`, "DD-MM-YYYY H:mm"))) {
      //    item.status = "completada"
      // }


      if (item.status === "pendiente") {
         const equipos = item.invitations_team1.concat(item.invitations_team2);
         const arrayInvit = equipos.filter(
            (invitation) => invitation.toId === user._id
         )
         if (arrayInvit[0].status === "accepted") {
            setIsAccepted(true)
         } 
         else {
            setIsAccepted(false)
         }
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
      let finalScore
      if (item.team_1.filter(element => element._id === user._id).length === 1){
         finalScore = `${result1}-${result2}`
      }
      else {
         finalScore = `${result2}-${result1}`
      }
      axios
      .put(`${uri}/api/result/updateResult/match/${item._id}/user/${user._id}`, {score: finalScore}, {headers: {Authorization: `Bearer ${userString}`,},})
      .then(({ data }) => {
         item = data
      });
   };

   const cancelHandler = () => {
      axios
      .put(`${uri}/api/invitation/invitRejected/${item._id}/user/${user._id}`, {}, {headers: {Authorization: `Bearer ${userString}`,},})
      .then(({ data }) => {
         item.status = "cancelada"
      });
      
   }
   
   const statusIs = (status) => {
      if ( status === "completada" || status === "conflicto" || (
         status === "lista" && moment().isSameOrAfter(moment(`${item.date} ${item.time}`, "DD-MM-YYYY H:mm")))){
         return "completa"
      }
      if (status === "confirmada") 
         return score[0] > score[1] ? "win" : "lost"
      return status
   }


   return (
      <TouchableOpacity  onPress={() => {
        if (setOpenedMatch) setOpenedMatch(!openedMatch);
        setShowInfo(!showInfo || false);
      }}
                        style={[itemStyles.item, {borderColor: colorSet[statusIs(item.status)] , borderWidth:1.5}]}>
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
               
                  {item.status === "confirmada"
                  ?<Text style={[itemStyles.text, { fontSize: 25, color: colorSet[statusIs(item.status)] }]}> 
                     {`${score[0]} - ${score[1]}`}
                  </Text>
                  :<>
                     <Text style={[itemStyles.text, { textTransform: "uppercase", color: colorSet[statusIs(item.status)] }]}>
                        {statusIs(item.status)}
                     </Text>
                     <Text style={[itemStyles.text, { textTransform: "uppercase", color: colorSet[statusIs(item.status)] }]}>
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
            <View style={{marginBottom: item.status === "pendiente" || statusIs(item.status) === "completa" ? 0 : 16}}>
               <Text style={[itemStyles.text]}>
                  El partido se { item.status === "pendiente" || item.status === "lista" ? "disputara" : "disputo"} a las {item.time}
               </Text>
               {item.invitationText === ""
               ? <></>
               : <>
                  <Text style={[itemStyles.text]}>
                     {item.invitationText}
                  </Text>
                  {item.status==="conflicto"
                  ?<>
                     <Text style={[cardStyles.cancelTxt, {color: colorSet.warning, textAlign: "center"}]}>
                        Los resultados ingresados anteriormente no coinciden.
                     </Text>
                     <Text style={[cardStyles.cancelTxt, {color: colorSet.warning, textAlign: "center"}]}>
                        Vuelva a intentarlo
                     </Text>
                  </>
                  :<></>}
               </>}
            </View>

               { (item.status === "pendiente") 
               ?<View>
                  {!isAccepted
                  ? <View style={{ marginTop: 30}}>
                        <TouchableOpacity style={[cardStyles.confirmButton, { backgroundColor: colorSet[item.status]}]}
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

               { (statusIs(item.status) === "lista") 
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

               { (statusIs(item.status) === "completa") 
               ?<View>
                  { !isScored 
                  ? <View style={{ marginTop: 30, flexDirection: "row"}}>

                     <TextInput style={[cardStyles.input, {height: 40, alignSelf: "center"}]}
                                    name="text" keyboardType="default"
                                    placeholder="Resultado"
                                    value={result1} 
                                    onChangeText={ text => setResult1(parseInt(text))}
                     />
                     
                     <TouchableOpacity style={[cardStyles.confirmButton, { backgroundColor: colorSet[statusIs(item.status)]}]}
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
