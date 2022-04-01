import React from "react";

import {
  Button,
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import Welcome from "./Welcome";
import { Formik } from "formik";
import * as yup from "yup";
import { form } from "../styles/form";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

function Login({ navigation }) {
  const handleLogin = async (values) => {
    try {
      const result = await axios.post(`${uri}/api/user/login`, values);
      const userStored = result.data.token;
      await AsyncStorage.setItem("userInfo", userStored);
      // const returnedUser = await AsyncStorage.getItem('userInfo')
      // console.log(`STORED USER ES`, returnedUser)
      result.status == 200 ? navigation.navigate("Home") : null;
    } catch (err) {
      console.log(err);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string("Ingresa tu email o nombre de usuario")
      .required("*Campo requerido"),

    password: yup
      .string("Ingresa tu Contraseña")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("*Campo requerido"),
  });

  return (
    <SafeAreaView style={form.container}>
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => handleLogin(values)}
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

            <TouchableOpacity style={form.colorBtn} onPress={handleSubmit}>
              <Text style={form.colorTxtBtn}>Aceptar</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <Text
        style={form.colorTxtBtn}
        onPress={() => navigation.navigate("Register")}
      >
        registro
      </Text>
      <Text
        style={form.colorTxtBtn}
        onPress={() => navigation.navigate("Welcome")}
      >
        welcome
      </Text>
    </SafeAreaView>
  );
}

export default Login;
