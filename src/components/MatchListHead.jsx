import { View, Text} from "react-native";
import React from "react";

const ListHead = ({labels, styling}) => {
  return (
      <View style={styling}>
            <View style={{width: 85, alignItems: "center"}}>
               <Text style={{ fontSize: 18, color: '#FFFFFF' }}>
                  {labels[0]}
               </Text>
            </View>
            
            <View style={{width: 150, alignItems: "center"}}>
               <Text style={{ fontSize: 18, color: '#FFFFFF'}}>
                  {labels[1]? labels[1]:null}
               </Text>
            </View>
            
            <View style={{width: 85, alignItems: "center"}}>
               <Text style={{ fontSize: 18, color: '#FFFFFF'}}>
                  {labels[2]}
               </Text>
            </View>
      </View> )
};

export default ListHead;

