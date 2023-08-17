import { StyleSheet } from "react-native";
import { colorSet } from "./colorSet";


export const newLeagueStyles = StyleSheet.create({
   back: {
      flex: 1,
      backgroundColor: colorSet.background
   },
   head: {
      /*flexDirection: "row",*/
      height: 250,
      paddingTop: 30,
   },
   info: {
      flex: 1,
      justifyContent: "flex-end"
   },
   title:{
      marginBottom: 0,
      fontSize: 32,
      alignSelf: "center",
      fontStyle: "italic",
      fontWeight: "bold",
      color: colorSet.text
   },
   pickerButton: {
      height: 50, 
      marginHorizontal: 8,
      marginBottom: 0,
      alignSelf: "center"/*"flex-end"*/, 
      justifyContent:"center"
   },
   listHead:{
      paddingVertical: 8,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      marginBottom: 6,
      flexDirection: "row",
      justifyContent: "space-evenly",
      //backgroundColor: colorSet.content
   },

   body: {
      flex: 1,
      marginHorizontal:16,
      marginVertical: 10
   },
   list: {
      flex: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
   },


   item: {
      height: 70,
      marginBottom: 6,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
      backgroundColor: colorSet.content
   },
   text: {
      fontSize: 18, 
      alignSelf: "center",
      color: colorSet.text,
   },

   team: {
      justifyContent: "center",
      alignContent: "center",
      borderRadius: 10
   },
   info: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      //backgroundColor: colorSet.button
    },
    img: {
      height: 46,
      aspectRatio:1,
      borderRadius: 92,
      alignSelf: "center"
   },
   nickContainer: {
      justifyContent: "center",
      alignItems: "center"
   },
   nick: { 
      width: 182,
      flexDirection: "row",
      paddingHorizontal:10,
      alignContent: "center"
   },
})








export const leagueStyles = StyleSheet.create({
   back: {
      flex: 1,
      paddingTop: 40,
      backgroundColor:"#0e0b29"
    },

   head: {
      flex: 4,
      backgroundColor: "#9b59b6"
   },
   body: {
      flex: 8,
      backgroundColor: "#090717",
   },
   foot: {
      height: 58,
      //backgroundColor: "#090717",
   },

   menu: {
      marginLeft:16,
      marginRight:16,
      height: 50, 
      width: "auto"
   },
   info: {
      marginLeft:16,
      marginRight:16,
      flex: 1,
      justifyContent: "center"
   },
   title:{
      fontSize: 25,
      alignSelf: "center",
      fontStyle: "italic",
      fontWeight: "bold",
      color: "white",
   },

   listHead:{
      marginLeft:16,
      marginRight:16
   },
   enum:{
      flexDirection: "row",
      marginBottom: 3
   },
   item: {
      flex: 1,
      flexDirection: "row",
      height: 50,
      marginBottom: 3,
      borderRadius: 10,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      // borderWidth: 3
   },

   user:{
      flexDirection: "row",
      height: 50,
      marginLeft:16,
      marginRight:16,
      marginBottom:"auto",
      marginTop: "auto",
      borderRadius: 10,
      backgroundColor: "#090717",
   },
   rank: {
      aspectRatio:1,
      justifyContent: "center",
      alignItems: "center"
   },
   img: {
      height: 46,
      margin:2,
      aspectRatio:1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "grey",
      borderRadius: 100
   },
   nick: {
      flex: 1,
      width: "auto",
      justifyContent: "center",
      alignItems: "center"
   },
   elo:{
      width: 100,
      justifyContent: "center",
      alignItems: "center"
   },
   join: {
      height: 50,
      marginLeft:"auto",
      marginRight: "auto",
      marginBottom:"auto",
      marginTop: "auto",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center"
   },
   joinTxt: {
      color: '#FFFFFF',
      fontSize: 20,
      marginLeft:16,
      marginRight: 16,
    },

    checkContainer: {
      width: 50, 
      height: 50,
      justifyContent: "center",
      alignItems: "center"
    }
})