import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* import { styles } from "../styles/Styles"; */

import Register from "./Register";
import Login from "./Login";
import { useDispatch, useSelector } from "react-redux";
import { setUserMe } from "../state/user";
export const form = StyleSheet.create({
  container: {
    backgroundColor: "#0e0b29",
    flex: 1,
    paddingTop: 100,
    justifyContent: "flex-start",
    color: "white",
  },
  formTittle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 7,
    width: "80%",
    alignSelf: "center",
  },
  inputs: {
    width: "80%",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    paddingLeft: 20,
    borderWidth: 2,
    borderRadius: 7,
    borderColor: "white",
    paddingRight: 12,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "white",
  },
  colorBtn: {
    alignSelf: "center",
    width: "50%",
    borderWidth: 1,
    borderColor: "#f27e18",
    backgroundColor: "#e69249",
    padding: 15,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 7,
  },
  colorTxtBtn: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
});
const welcome = StyleSheet.create({
  container: {
    backgroundColor: "#0e0b29",
    flex: 1,
    justifyContent: "space-evenly",
  },
  info: {
    marginTop: 50,
    color: "white",
    fontSize: 48,
    textAlign: "center",
  },
  colorBtn: {
    borderWidth: 1,
    borderColor: "#f27e18",
    backgroundColor: "#e69249",
    padding: 15,
    marginTop: 20,
    marginRight: 20,
    borderRadius: 7,
  },
  colorTxtBtn: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "900",
    fontFamily: "Roboto",
  },
  btnContainer: {
    backgroundColor: "#0e0b29",
    alignSelf: "center",
    marginBottom: "20%",
    width: "50%",
  },
});

function Welcome({ navigation }) {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userString, setUserString] = useState("")

  useEffect(() => {
    const asyncUser = async () => {
      const result = await AsyncStorage.getItem("userInfo");
      setUserString(result)
      if (result) {
        await dispatch(setUserMe(userString));
        navigation.navigate("Home")
        return
      };
      const { payload } = await dispatch(setUserMe(userString));
    };
    asyncUser();
  }, []);

  return (
    <>
      {userString===null ? (
        <View style={welcome.container}>
          <Text style={welcome.info}>Bienvenido a Match Maker</Text>

          <View style={welcome.btnContainer}>
            <TouchableOpacity
              style={welcome.colorBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={welcome.colorTxtBtn}>Iniciar Sesion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={welcome.colorBtn}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={welcome.colorTxtBtn}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : <View style={welcome.container}></View> }
    </>
  );
}

export default Welcome;
