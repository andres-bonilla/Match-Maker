import { StyleSheet } from "react-native";

import { colorSet } from "./colorSet";

/*//populate users al add user y devolver usuarios
//setear opciones de colores al crear una liga
//imagenes con fondo en degradado de transparente a negro
//cambiar color a triangulo de picker
//probar redondeado a container de info de liga
//coherencia de redondeados


//Matchmaker h4
subtitulos H5
texto normal 18
texto botones 18 todas en mayusculas*/ 


export const matchStyles = StyleSheet.create({

   back: {
      flex: 1,
      backgroundColor: colorSet.background
   },

   ///////////////////////////////
   head: {
      height: 200,
      paddingTop: 30,
      paddingHorizontal: 16
   },
   info: {
      flex: 1,
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
   pickerButton: {
      height: 50, 
      marginHorizontal: 8,
      alignSelf: "center", 
      justifyContent:"center"
   },
   listHead:{
      paddingVertical: 8,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
      backgroundColor: colorSet.content
   },

   ///////////////////////////////
   body: {
      flex: 1,
      marginHorizontal:16
   },
   list: {
      flex: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: colorSet.content
   },
   labels:{
      flexDirection: "row",
      height: 50,
      marginBottom: 3,
      alignItems: "center"
   },

   ////////////////////////////////
   foot: {
      backgroundColor: colorSet.background,
   },
   calendar: {
      height: 170,
      marginTop: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colorSet.content
   },
   time: {
      height: 30,
      width: 66,   
      borderRadius: 10,
      marginTop: 8,
      marginBottom: 6,
      paddingHorizontal: 8,
      marginHorizontal: 4,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "white"
   },
   timeTxt: {
      fontSize: 16,
      textAlign: "center",
      fontWeight: "bold",
      color: colorSet.content
   },

   createButton: {
      height: 50,
      marginLeft:"auto",
      marginRight: "auto",
      marginTop: 30,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center"
   },
   buttonTxt: {
      fontSize: 20,
      marginHorizontal:16,
      color: colorSet.text,
    },
   errTxt: { 
      margin:5,
      alignSelf: "center",
      color: colorSet.error
   }
})

export const itemStyles = StyleSheet.create({

   item: {
      height: 66,
      flexDirection: "row",
      marginVertical: 3,
      borderRadius: 10,
      justifyContent: "space-evenly",
   },
   img: {
      height: 46,
      aspectRatio:1,
      borderRadius: 92,
      alignSelf: "center"
   },
   nick: {
      width: 182, 
      flexDirection: "row",
      paddingHorizontal:10,
      alignContent: "center",
      borderRadius: 10,
   },
   text: {
      fontSize: 18, 
      color: '#FFFFFF',
      alignSelf: "center",
      marginLeft: 10
   },
   checkContainer: {
       width: 60,
      justifyContent: "center",
      alignItems: "center",
    }
})

export const pickerStyles = StyleSheet.create({
   back: {
      height: "100%",
      paddingVertical: 16,  
      backgroundColor: colorSet.modalBack
   },
   pressArea: {
      flex: 1, 
      width: "100%",
   },
   body: {
      flex: 1,
      marginHorizontal: 16,
      borderRadius: 10,
      backgroundColor: colorSet.content
   },
   text: { 
      margin: 8,
      fontSize: 18, 
      textAlign: 'center',
      color: colorSet.text
   }
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
   txt: {
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
      paddingHorizontal: 12,
      marginHorizontal: 8,
      borderRadius: 10, 
      fontSize: 16,
      color: colorSet.content,
      backgroundColor: colorSet.text,
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
      color: colorSet.text,
   },
})