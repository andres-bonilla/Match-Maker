import { StyleSheet } from "react-native";

import { colorSet } from "./colorSet";

export const recordStyles = StyleSheet.create({
   back: {
      flex: 1,
      backgroundColor: colorSet.background
   },

   head: {
      paddingTop: 30,
      paddingHorizontal: 16
   },
   info: {
      marginBottom: 10,
      justifyContent: "center"
   },
   title:{
      paddingTop:20,
      fontSize: 32,
      alignSelf: "center",
      fontStyle: "italic",
      fontWeight: "bold",
      color: colorSet.text
   },
   calendar: {
      height: 170,
      marginVertical: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colorSet.content
   },
   show: {
      height: 30,   
      borderRadius: 10,
      marginTop: 8,
      marginBottom: 6,
      paddingHorizontal: 8,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "white"
   },
   showTxt: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorSet.content
   },


   body: {
      flex: 1,
      marginHorizontal:16,
      marginBottom: 10
   },
   listHead:{
      paddingVertical: 8,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
      backgroundColor: colorSet.content
   },
   list: {
      flex: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      marginTop: 6
   },
})

export const itemStyles = StyleSheet.create({
   item: {
      height: "auto",
      width: "100%",
      marginBottom: 6,
      borderRadius: 10,
      backgroundColor: colorSet.content
   },
   head: {
      height: 120,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between"
   },
   img: {
      height: 46,
      aspectRatio:1,
      borderRadius: 92,
      alignSelf: "center"
   },
   team: {
      width: 120,
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
   text: {
      fontSize: 18, 
      alignSelf: "center",
      color: colorSet.text,
   },
})

export const cardStyles = StyleSheet.create({
   back: {
      height: "100%",  
      justifyContent: "flex-end",
      backgroundColor: colorSet.modalBack
   },
   body: {
      flex: 1,
      marginHorizontal: 16,
      paddingHorizontal: 8,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: colorSet.content
   },
   closeButton: {
      marginTop: 10, 
      alignItems: "flex-end"
   },
   titleContainer: { 
      height: 50,
      alignItems: "center", 
      justifyContent: "center"
   },
   title: { 
      fontSize: 32, 
      marginBottom: 8, 
      color: colorSet.text
   },
   text: {
      fontSize: 18,
      marginTop: 12,
      paddingHorizontal: 8,  
      color: colorSet.text
   },
   inputContainer: { 
      height: 84, 
      marginTop: 16, 
      borderRadius: 10
   },
   input: { 
      width:90,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      borderRadius: 10, 
      fontSize: 16,
      color: colorSet.content,
      backgroundColor: colorSet.text,
   },
   cancelButton: {
      height: 48,
      marginLeft:"auto",
      marginRight: "auto",
      marginBottom:"auto",
      marginTop: "auto",
      justifyContent: "center",
      alignItems: "center"
   },
   cancelTxt:{
      fontSize: 16,
   },
   confirmButton: {
      height: 50,
      marginLeft:"auto",
      marginRight: "auto",
      marginBottom:"auto",
      marginTop: "auto",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colorSet.button
   },
   buttonTxt: {
      fontSize: 20,
      marginHorizontal:16,
      textTransform: "uppercase",
      color: colorSet.text,
   },
})