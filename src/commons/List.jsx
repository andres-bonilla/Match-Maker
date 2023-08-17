import React from "react";
import { View} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const List = ({list, Element, marginNum, colorLeague}) => {
   return (
      <ScrollView >
         <View style={ { marginHorizontal: marginNum || 16 } }>
            { list.map( (item, i) => {
               return (
                  <Element item={item} key={i} i={i} colorLeague={colorLeague} />
               )}
            )}
         </View>
      </ScrollView>
)}

export default List;
