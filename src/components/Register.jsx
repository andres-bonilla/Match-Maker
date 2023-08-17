import React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { formR } from "../styles/form";
import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

function Register({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (values) => {
    setIsLoading(true);
    axios.post(`${uri}/api/user/register`, values).then((res) => {
      setIsLoading(false)
      res.status == 201 ? navigation.navigate("Login") : null;
    });
  };

  const validationSchema = yup.object().shape({
    name: yup.string("Ingresa tu nombre").required("*Campo requerido"),
    surname: yup.string("Ingresa tu apellido").required("*Campo requerido"),

    nickname: yup
      .string("Ingresa tu nickname")
      .required("*Campo requerido")
      .max(10, "El nickname debe tener un maximo de 10 caracteres"),

    email: yup
      .string("Ingresa tu email")
      .required("*Campo requerido")
      .email("Ingresa un Email válido"),

    password: yup
      .string("Ingresa tu eontraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("*Campo requerido")
      .matches(
        /^(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{8,}$/,
        "La contraseña debe tener al menos una mayúscula y un número"
      ),
  });

  return (
    <SafeAreaView style={formR.container}>
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={{
          name: "",
          surname: "",
          email: "",
          password: "",
          nickname: "",
          age: "26",
        }}
        onSubmit={(values) => handleRegister(values)}
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
            <Text style={formR.formTittle}>Inicia Sesión</Text>

            <View style={formR.inputContainer}>
              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                keyboardType="default"
                placeholder="Nombre"
                name="name"
              />

              {errors.name && touched.name && <Text>{errors.name}</Text>}

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("surname")}
                onBlur={handleBlur("surname")}
                value={values.surname}
                keyboardType="default"
                placeholder="Apellido"
                name="surname"
              />

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("nickname")}
                onBlur={handleBlur("nickname")}
                value={values.nickname}
                keyboardType="default"
                placeholder="Nickname"
                name="nickname"
              />

              {errors.surname && touched.surname && (
                <Text>{errors.surname}</Text>
              )}

              <TextInput
                style={formR.inputs}
                placeholder="Email"
                name="email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />

              {errors.email && touched.email && <Text>{errors.email}</Text>}

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                keyboardType="default"
                secureTextEntry={true}
                placeholder="Password"
                name="password"
              />

              {errors.password && touched.password && (
                <Text>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity style={formR.colorBtn} onPress={handleSubmit}>
              <Text style={formR.colorTxtBtn}>REGISTRARSE</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <Text
        style={formR.colorTxtBtn}
        onPress={() => navigation.navigate("Login")}
      >
        LOGIN
      </Text>
      {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> : null}
    </SafeAreaView>
  );
}

export default Register;
