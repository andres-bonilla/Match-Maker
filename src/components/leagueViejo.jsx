import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ImageBackground } from "react-native";
import List from "../commons/List";

import { leagueStyles } from "../styles/league";
import FootLigue from "./FootLeague";
import Constants from "expo-constants";
import axios from "axios";
import ItemLeague from "./ItemLeague";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { setMembers } from "../state/memberList";

const League = ({ navigation }) => {
  const dispatch = useDispatch()
  const { state, navigate } = navigation;

  const userData = useSelector((state) => state.user)
  const selectLeague = useSelector((state) => state.selectLeague)
  const members = useSelector((state) => state.members)

  const leagueId = useSelector((state) => state.leagueId)

  let [memberList, setMemberList] = useState([]);
  let [leagueList, setLeagueList] = useState([]);
  let [actualleague, setActualLeague] = useState({});
  let [user, setUser] = useState({})
  let [selectedValue, setSelectedValue] = useState(" ");

  const { manifest } = Constants;
  const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

  useEffect(() => {

    let rank = 0

    axios
    .get(`${uri}/api/league/getUsers/${state.params._id}`)
    .then(({ data })=>{
       setMemberList( data.map( (element, i) =>{
          if ( userData._id === element._id) 
                rank = i+1
          return {
             id: element._id,
             rank: i+1,
             color:"blue",
             nickname: element.nickname,
             elo: 2931,
          }
       }))
    })
    .then(()=>{
       setUser({
          id: userData._id,
          rank: rank,
          color:"red",
          nickname: userData.nickname,
          elo: 2931,
       })
    })

    axios
    .get(`${uri}/api/user/getLeagues/${userData._id}`)
    .then(({data})=>{
       setLeagueList(data)
    })

 },[members])

  const changeHandler = (itemValue) => {
    axios
    .get(`${uri}/api/league/showLeague/${itemValue}`)
    .then(({ data }) => {
      setActualLeague(data);
    });
  };

  return (
    <SafeAreaView style={leagueStyles.back}>
       <View
        style={[leagueStyles.head, { backgroundColor: actualleague.color }]}
      >
       {/* <View style={leagueStyles.menu}>
          <Picker style={{ height: 50, width: 40, alignSelf: "flex-end", color: actualleague.color }}
            selectedValue={selectedValue}

            itemStyle={{ height: 50 }}
            onValueChange={(itemValue, itemIndex) => {
              state.params._id = itemValue
              dispatch(setMembers(itemValue));
              changeHandler(itemValue);
              setSelectedValue(itemValue);
            }}
          >
            {leagueList.map((element, i) => (
              <Picker.Item
                label={element.name}
                value={element._id}
                key={i + 1}
              />
            ))}
          </Picker>
        </View> */}
        {state.params ?
        <ImageBackground resizeMode="cover" source={{uri: state.params.img}} style={{flex: 1}}>
          <View style={leagueStyles.info}>
            <Text style={leagueStyles.title}>
              {state.params.name}
            </Text>
          </View>
        </ImageBackground>
        : null}
      </View>

      <View style={leagueStyles.body}>
        <View style={leagueStyles.listHead}>
          <View style={leagueStyles.enum}>
            <View
              style={{ width: 50, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}>Rank</Text>
            </View>
            <View
              style={{ width: 50, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}></Text>
            </View>
            <View
              style={{
                flex: 1,
                width: "auto",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>Nick</Text>
            </View>
            <View
              style={{ width: 100, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}>ELO</Text>
            </View>
          </View>
        </View>

        {state.params ? (
          <>
            <List list={memberList} Element={ItemLeague} />
            <FootLigue ligueId={selectLeague._id} userData={userData} />
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default League;
