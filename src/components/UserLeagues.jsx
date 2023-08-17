import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ligaStyles } from "../styles/league";
import { profile } from "../styles/profile";

const UserLeagues = ({ item, i }) => {
  // const onPress = () => {
  //   navigation.navigate("Ligas");
  // };

  return (
    <TouchableOpacity>
      <View
        style={[ligaStyles.item, { backgroundColor: `${item.color}` }]}
        key={i}
      >
        <View style={ligaStyles.rank}>
          <Text style={{ color: "#FFFFFF" }}>
            {parseInt(Math.random() * (1 - 20 + 1) + 20)}
          </Text>
        </View>
        <View style={[ligaStyles.img, { backgroundColor: item.code }]}>
          <Image style={profile.cardImage} source={{ uri: item.img }} />
        </View>
        <View style={ligaStyles.nick}>
          <Text style={{ color: "#FFFFFF" }}>{item.name}</Text>
        </View>
        <View style={ligaStyles.elo}>
          <Text style={{ color: "#FFFFFF" }}>
            {parseInt(Math.random() * (400 - 3000 + 1) + 3000)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserLeagues;
