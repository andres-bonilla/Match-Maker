import { View, Text, Image } from "react-native";
import React from "react";
import { leagueStyles, newLeagueStyles } from "../styles/league";
import { itemStyles } from "../styles/match";
import { colorSet } from "../styles/colorSet";

const ItemLeague = ({ item, colorLeague }) => {
  return (
    <View style={[newLeagueStyles.item, {borderColor: colorLeague , borderWidth:1.5}]}>
         
            <View style={[newLeagueStyles.team, {borderColor: "blue" , borderWidth:0}]}>
               <Text style={[newLeagueStyles.text, {marginBottom: 3}]}>
               {item.rank}  
              </Text>
            </View>
            
            
            <View style={[newLeagueStyles.nick, {borderColor: "red" , borderWidth:0}]}>

              <Image style={newLeagueStyles.img} source={{ uri: item.img }}/>
            
              <Text style={newLeagueStyles.text}>
                {item.nickname}
              </Text>
          </View>

            <View style={[newLeagueStyles.team, {borderColor: "blue" , borderWidth:0}]}>
               <Text style={[newLeagueStyles.text, {marginBottom: 3}]}>
               {item.elo[0].value}
              </Text>
            </View>


         {/*<View style={leagueStyles.item}>
      <View style={leagueStyles.rank}>
        <Text style={{ color: "#FFFFFF" }}>{item.rank}</Text>
      </View>
      <Image style={leagueStyles.img} source={{ uri: item.img }}/>
      <View style={leagueStyles.nick}>
        <Text style={{ color: "#FFFFFF" }}>{item.nickname}</Text>
      </View>
      <View style={leagueStyles.elo}>
        <Text style={{ color: "#FFFFFF" }}>{item.elo[0].value}</Text>
      </View>
    </View>*/}
        </View>


    
  );
};

export default ItemLeague;
