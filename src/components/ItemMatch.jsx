import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeTeam, setTeam } from "../state/teams";

import { CheckBox } from 'react-native-elements';
import { itemStyles } from "../styles/match";
import { colorSet } from "../styles/colorSet";

const ItemMatch = ({ item, i }) => {
      
   let [select, setSelect] = useState(false),
      [select2, setSelect2] = useState(false),
      [colorIs, setColorIs] = useState(colorSet.content)

   const dispatch = useDispatch();

   const isCreated = useSelector( state => state.checks )

   useEffect(()=>{

      setColorIs(colorSet.content)
      setSelect(false)
      setSelect2(false)

      if (!i) {
         dispatch( setTeam({ team: "teamA", id: item._id, nick: item.nickname }))
         setColorIs("#3774C4")
      }
   },[isCreated])

      
   const checker = () => {
      if ( select ){
         dispatch( removeTeam({ team: "teamA", id: item._id }))
         setColorIs(colorSet.content)
      }
      else {
         dispatch( setTeam({ team: "teamA", id: item._id, nick: item.nickname }))
         setColorIs("#3774C4")
      }
      setSelect(!select)
      setSelect2(false)
   }
      
   const checker2 = () => {
      if ( select2 ){
         dispatch( removeTeam({ team: "teamB", id: item._id }))
         setColorIs(colorSet.content)
      }
      else {
         dispatch( setTeam({ team: "teamB", id: item._id, nick: item.nickname }))
         setColorIs("#C43737")
      }
      setSelect2(!select2)
      setSelect(false)
   }

   return (
      <View style={itemStyles.item}>
         <View style={itemStyles.checkContainer}>
            {i 
            ? <CheckBox
               checked={ select } onPress={checker}
               iconType="ionicon"
               uncheckedIcon="checkbox-outline" uncheckedColor={colorSet.text}
               checkedIcon="checkbox" checkedColor="#3774C4"
               size={30}
            />
            : <></>}
         </View>
         
         <View style={[itemStyles.nick, {borderColor: colorIs , borderWidth:1.5}]}>
            <Image style={itemStyles.img} source={{ uri: item.img }}/>
            
            <Text style={itemStyles.text}>
               {item.nickname}
            </Text>
         </View>
            
         <View style={itemStyles.checkContainer}>
            {i 
            ? <CheckBox
               checked={ select2 } onPress={checker2}
               iconType="ionicon"
               uncheckedIcon="checkbox-outline" uncheckedColor= {colorSet.text}
               checkedIcon="checkbox" checkedColor="#C43737"
               size={30}
            />
            : <></>}
         </View>
      </View> 
  );
};

export default ItemMatch;

{/* <View style={itemStyles.elo}>
            <View style={itemStyles.checkContainer}>
               <CheckBox
                  checked={select} onPress={checker}
                  iconType="ionicon"
                  uncheckedIcon="checkbox-outline" uncheckedColor='white'
                  checkedIcon="checkbox" checkedColor="#45fc03"

               />
            </View>
         </View>
         <View style={{flex: 1,width: 100,backgroundColor: "green", flexDirection: "row"}}>
            <View style={{flex: 1,width: 70, justifyContent: "center", alignItems: "flex-end", }}>
               <Image style={itemStyles.img} source={{ uri: item.img }}/>
            </View>
         
            <View style={itemStyles.nick}>
               <Text style={itemStyles.text}>
                  {item.nickname}
               </Text>
            </View>
         </View>
         

         <View style={itemStyles.elo}>
            <View style={itemStyles.checkContainer}>
               <CheckBox
                  checked={select2} onPress={checker2}
                  iconType="ionicon"
                  uncheckedIcon="checkbox-outline" uncheckedColor='white'
                  checkedIcon="checkbox" checkedColor="#45fc03"

               />
            </View>
         </View> */}