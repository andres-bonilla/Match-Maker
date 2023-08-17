import React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import { Formik } from "formik";
import * as yup from "yup";
import { form } from "../styles/form";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

function Login({ navigation }) {

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const handleLogin = async (values) => {
    try {
      setIsLoading(true)
      const result = await axios.post(`${uri}/api/user/login`, values);
      const userStored = result.data.token;
      await AsyncStorage.setItem("userInfo", userStored);
      result.status == 200 ? navigation.navigate("Home") : null;

    } catch (err) {
      setIsLoading(false)
      setErrorMessage(true)
      console.log(err);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string("Ingresa tu email o nombre de usuario")
      .required("*Campo requerido"),

    password: yup
      .string("Ingresa tu Contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("*Campo requerido"),
  });

  return (
    <SafeAreaView style={form.container}>
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, {resetForm}) => {
          handleLogin(values, resetForm)}}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <Text style={form.formTittle}>Inicia Sesión</Text>
            
            <View style={form.inputContainer}>
            <TextInput
              style={form.inputs}
              placeholder="Email o Nickname"
              name="email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />

            {errors.email && touched.email && <Text>{errors.email}</Text>}

            <TextInput
              style={form.inputs}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry={true}
              placeholder="Password"
              name="password"
            />
            {errors.password && touched.password && (
              <Text>{errors.password}</Text>
            )}
            </View>

            <TouchableOpacity disable style={form.colorBtn} onPress={handleSubmit}>
              <Text style={form.colorTxtBtn}>ACEPTAR</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      {errorMessage ? <Text style={{color : "white", fontSize : 18, textAlign : "center", backgroundColor: "red", marginTop: 20, borderRadius: 20}}>El email o la contraseña ingresado no coinceden con ningun usuario registrado</Text> : null}
      <Text
        style={form.colorTxtBtn}
        onPress={() => {setErrorMessage(false)
          navigation.navigate("Register")}}
      >
        No tenes usuario? Registrate!
      </Text>
      {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> : null}
    </SafeAreaView>
  );
}

export default Login;
