import { StyleSheet, Dimensions, Platform } from "react-native";

let { height, width } = Dimensions.get("window");

export const profile = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      alignItems: "center",
      //flex: 1,
      backgroundColor: "#0e0b29",
      ...Platform.select({
        ios: {
          marginTop: -1,
        },
      }),
    },
    userImage: {
      borderColor: "#FFF",
      borderRadius: 85,
      borderWidth: 3,
      height: 170,
      marginBottom: 15,
      width: 170,
    },
    userNameText: {
      color: "#FFF",
      fontSize: 22,
      fontWeight: "bold",
      paddingBottom: 8,
      textAlign: "center",
    },
    settingsIcon: {
      alignSelf: "flex-end",
      marginTop: -30,
      height: 60,
      width: 48,
    },
    settingsMenu: {
      height: 100,
      marginBottom: 30,
    },
    menu: {
      height: 30,
      paddingTop: -30
    },
    containerList: {
      flex: 4,
      //justifyContent: 'center',
      //alignSelf: "flex-start",
      paddingTop: 22,
    },
    viewList: {
      //alignSelf: 'auto',
      flex: 2,
      justifyContent: "space-around",
    },
    item: {
      color: "#FFF",
      padding: 10,
      fontSize: 18,
    },
    header: {
        flexDirection: "row",
        marginBottom: 3,
        justifyContent: "space-around"
    },
    listContainer: {
      marginLeft:16,
      marginRight:16,
    },
    headerList: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
      paddingBottom: 8,
      textAlign: "center",
    },
    /******** card **************/
    card: {
      width: width,
      height: 60,
      flexDirection: "row",
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    cardImage: {
      height: 25,
      width: 25,
    },
    title: {
      flex: 1,
      color: "#FFFFFF",
      fontWeight: "bold",
      marginLeft: 40,
      alignItems: "center",
      width: 'auto'
    },
    rank: {
      flex: 1,
      color: "#FFFFFF",
      fontWeight: "bold",
      marginLeft: 50,
      alignSelf: "center",
    },
    elo: {
      flex: 1,
      color: "#FFFFFF",
      fontWeight: "bold",
      alignItems: 'center',
      width: 100
    },
  });