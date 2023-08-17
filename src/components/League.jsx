import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Pressable,
  Modal,
  Button,
  TextInput,
  ActivityIndicator,
  Image,
  Keyboard,
  Alert,
} from "react-native";

import axios from "axios";
import Constants from "expo-constants";

import "moment/locale/es";
import { Icon } from "react-native-elements";

import { leagueStyles, newLeagueStyles } from "../styles/league";

import List from "../commons/List";
import { useDispatch, useSelector } from "react-redux";
import ItemLeague from "./ItemLeague";
import FootLigue from "./FootLeague";
import { setLeagueId } from "../state/idLeague";
import { setMembers } from "../state/memberList";
import { setUserLeagues } from "../state/userLeague";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Formik } from "formik";
import * as yup from "yup";
import { formR } from "../styles/form";

import { CheckBox } from "react-native-elements";
import { setUserMe } from "../state/user";
import { colorSet } from "../styles/colorSet";
import ListHead from "./MatchListHead";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

const LeagueHome = ({ navigation }) => {
  const { manifest } = Constants;
  const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

  let [memberList, setMemberList] = useState([]);
  let [actualleague, setActualLeague] = useState({});
  let [user, setUser] = useState({});
  let [showCard, setShowCard] = useState(false);
  let [showSecretkeyCard, setShowSecretkeyCard] = useState(false);
  let [secretKey, setSecretKey] = useState("");
  let [secretError, setSecretError] = useState("");

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user);

  const leagueId = useSelector((state) => state.leagueId);

  const leagueList = useSelector((state) => state.userLeagues);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!leagueId && !leagueList.length) return;
        const resData = await dispatch(
          setUserLeagues({ userId: userData._id })
        );
        if (leagueId === "" && resData.payload[0])
          dispatch(setLeagueId(resData.payload[0].league._id));

        let auxLeagueId = leagueId === "" ? leagueList[0].league._id : leagueId;

        const { payload } = await dispatch(setMembers(auxLeagueId));

        setMemberList(payload);

        const { data } = await axios.get(
          `${uri}/api/league/showLeague/${auxLeagueId}`
        );

        setActualLeague(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [leagueId, userData]);

  const selectHandler = (id) => {
    dispatch(setLeagueId(id));
    setShowCard(!showCard);
  };

  const joinHandler = () => {
    if (actualleague.isPrivate) {
      setShowSecretkeyCard(true);
    }
    const loadData = async () => {
      try {
        const userString = await AsyncStorage.getItem("userInfo");
        await dispatch(setUserMe(userString));
        const resData = await dispatch(
          setUserLeagues({ userId: userData._id })
        );

        if (leagueId === "")
          await dispatch(setLeagueId(resData.payload[0]._id));

        const { payload } = await dispatch(
          setMembers(leagueId === "" ? leagueList[0]._id : leagueId)
        );
        setMemberList(payload);

        const { data } = await axios.get(
          `${uri}/api/league/showLeague/${leagueId}`
        );

        setActualLeague(data);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        setSecretError("Hubo un problema, por favor intenta de nuevo");
      }
    };

    const addUserFunc = async () => {
      try {
        const result = await axios.put(
          `${uri}/api/league/${leagueId}/addUser/${userData._id}`,
          {
            enteredKey: secretKey,
          }
        );
        await loadData();
        setSecretError("");

        if (result && result.request.status === 200) {
          Alert.alert(
            "Bienvenido!",
            `Te uniste a la liga ${actualleague.name}`
          );
          setSecretKey = "";
          setShowSecretkeyCard(false);
        } else setSecretError("Clave secreta inválida");
      } catch (error) {
        setSecretError("Clave secreta inválida");
        console.error(`Error: ${error.message}`);
      }
    };

    addUserFunc();
  };

  return (
    <SafeAreaView style={newLeagueStyles.back}>
      <Modal animationType="fade" transparent={true} visible={showCard}>
        <Pressable
          onPress={() => {
            setShowCard(false);
          }}
          style={{
            color: "white",
            height: "100%",
            backgroundColor: "rgba(30,30,50,0.85)",
            justifyContent: "center",
          }}
        >
          <View>
            <ScrollView>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 16,
                  backgroundColor: "#0e0b29",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ScrollView>
                    <View>
                      {leagueList[0] ? (
                        leagueList.map((item, i) => {
                          return (
                            <TouchableOpacity
                              style={{ padding: 7 }}
                              onPress={() => selectHandler(item.league._id)}
                              key={i}
                            >
                              <Text
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 16,
                                  textAlign: "center",
                                }}
                              >
                                {item.league.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            textAlign: "center",
                            padding: 10,
                          }}
                        >
                          Acá aparecerán tus ligas. Únete a una desde Home
                        </Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSecretkeyCard}
      >
        <Pressable
          onPress={() => {
            setShowSecretkeyCard(false);
            setSecretError("");
          }}
          style={{
            height: "100%",
            backgroundColor: "rgba(30,30,50,0.85)",
            justifyContent: "center",
          }}
        >
          <View>
            <ScrollView>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 16,
                  backgroundColor: "#0e0b29",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{ flex: 1, paddingVertical: 15, alignItems: "center" }}
                >
                  <Text
                    style={{ color: "white", paddingBottom: 15, fontSize: 18 }}
                  >
                    Ingrese clave secreta de 5 caracteres:
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      width: 100,
                      fontSize: 18,
                      textAlign: "center",
                    }}
                    secureTextEntry={true}
                    maxLength={5}
                    onChangeText={setSecretKey}
                    onSubmitEditing={() => {
                      Keyboard.dismiss;
                      if (secretKey) {
                        joinHandler(leagueId);
                      } else {
                        alert("Please provide a secretkey");
                      }
                    }}
                  />
                  {secretError.length > 1 ? (
                    <Text style={{ color: "red", marginTop: 10 }}>
                      {secretError}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      leagueStyles.join,
                      { backgroundColor: "#16a085", marginTop: 20 },
                    ]}
                    onPress={() => {
                      if (secretKey) {
                        joinHandler(leagueId);
                      } else {
                        setSecretError("Please provide a secretkey");
                      }
                    }}
                  >
                    <Text style={leagueStyles.joinTxt}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <View
        style={[newLeagueStyles.head, { backgroundColor: actualleague.color }]}
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: actualleague.img }}
          style={{ flex: 1 }}
        >
          <View style={{ width: "100%", height: "100%" }}>
            <ImageBackground
              resizeMode="stretch"
              source={require("../assets/gradient.png")}
              style={{ flex: 1 }}
            >
              <View style={[newLeagueStyles.info, { paddingTop: "20%" }]}>
                <Text style={newLeagueStyles.title}>{actualleague.name}</Text>

                <TouchableOpacity
                  onPress={() => setShowCard(true)}
                  style={newLeagueStyles.pickerButton}
                >
                  <Icon
                    name="caret-down-circle"
                    type="ionicon"
                    color={colorSet.text}
                    size={32}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </ImageBackground>
      </View>

      <View style={newLeagueStyles.body}>
        <ListHead
          labels={["Rank", "Usuario", "ELO"]}
          styling={newLeagueStyles.listHead}
        />

        <View style={newLeagueStyles.list}>
          {memberList[0] || leagueId ? (
            <List
              list={memberList}
              Element={ItemLeague}
              marginNum={1}
              colorLeague={actualleague.color}
            />
          ) : (
            <View
              style={{
                height: "100%",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Acá aparecerán los miembros cuando selecciones una liga. {"\n"}
                {"\n"}
                Prueba seleccionando una desde Home
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={{
            marginVertical: 20,
            height: 50,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#16a085",
            alignSelf: "center",
            paddingHorizontal: 20,
            position: "relative",
            // left: 10,
            // top: 10,
          }}
          onPress={() => navigation.navigate("Create a league")}
        >
          <Text style={{ fontSize: 18, color: "white" }}>CREAR LIGA</Text>
        </TouchableOpacity>

        {userData.leagues.includes(leagueId) ? (
          memberList.findIndex((user) => user._id === userData._id) > 6 ? (
            <View style={leagueStyles.foot}>
              <View style={leagueStyles.user}>
                <View style={leagueStyles.rank}>
                  <Text style={{ color: "#FFFFFF" }}>{"2"}</Text>
                </View>
                <View
                  style={[leagueStyles.img, { backgroundColor: user.color }]}
                ></View>
                <View style={leagueStyles.nick}>
                  <Text style={{ color: "#FFFFFF" }}>{userData.nickname}</Text>
                </View>
                <View style={leagueStyles.elo}>
                  <Text style={{ color: "#FFFFFF" }}>{"user.elo"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <></>
          )
        ) : (
          <>
            {leagueId ? (
              <View style={[leagueStyles.foot, { height: 100 }]}>
                <TouchableOpacity
                  style={[
                    leagueStyles.join,
                    { backgroundColor: actualleague.color /*"#16a085"*/ },
                  ]}
                  onPress={() => {
                    if (actualleague.isPrivate) {
                      setShowSecretkeyCard(true);
                    } else {
                      joinHandler(leagueId);
                    }
                  }}
                >
                  <Text style={leagueStyles.joinTxt}>Unirse</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const HomeScreen = ({ navigation }) => {
  const { manifest } = Constants;
  const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.user);

  let [select, setSelect] = useState(false);
  let [requiredSecretkey, setRequiredSecretKey] = useState("");

  const dispatch = useDispatch();

  const handleRegister = (values) => {
    values.admin = userData._id;
    values.isPrivate = select;
    if (values.secretKey === "") delete values.secretKey;
    setIsLoading(true);
    axios
      .post(`${uri}/api/league/new`, values)
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          dispatch(setLeagueId(res.data._id));
          return dispatch(setUserLeagues({ userId: userData._id }));
        }
      })
      .then(() => {
        return AsyncStorage.getItem("userInfo");
      })
      .then((userString) => {
        return dispatch(setUserMe(userString));
      })
      .then(() => {
        navigation.navigate("Leagues");
        Alert.alert("Liga creada!", `Se ha creado la liga ${values.name}`);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error es", error);
      });
  };

  const validationSchema = yup.object().shape({
    name: yup.string("Ingresa tu nombre").required("*Campo requerido"),
    // surname: yup.string("Ingresa tu apellido").required("*Campo requerido"),

    // nickname: yup
    //   .string("Ingresa tu nickname")
    //   .required("*Campo requerido")
    //   .max(10, "El nickname debe tener un maximo de 10 caracteres"),

    secretKey: yup
      .string("Ingrese una clave")
      .min(5, "La clave debe tener 5 caracteres")
      .matches(
        /^(?=(.*[A-Z]){1,}).*$/,
        "La contraseña debe tener al menos una mayúscula"
      )
      .matches(
        /^(?=(.*[0-9]){1,}).*$/,
        "La contraseña debe tener al menos un número"
      ),
  });

  const checker = () => {
    setSelect(!select);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090717",
      }}
    >
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={{
          name: "",
          sport: "",
          description: "",
          secretKey: "",
          color: "",
          img: "",
        }}
        onSubmit={(values) => {
          if (select && values.secretKey && values.secretKey.length === 5)
            handleRegister({ ...values, select });
          else if (!select && !values.secretKey) {
            handleRegister({ ...values, select });
          } 
        }}
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
            <Text style={formR.formTittle}>Nueva Liga</Text>

            <View style={formR.inputContainer}>
              <TextInput
                style={[formR.inputs, { marginTop: 40 }]}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                keyboardType="default"
                placeholder="Nombre de la liga"
                name="name"
              />

              {errors.name && touched.name && <Text>{errors.name}</Text>}

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("sport")}
                onBlur={handleBlur("sport")}
                value={values.sport}
                keyboardType="default"
                placeholder="Deporte"
                name="sport"
              />

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                keyboardType="default"
                placeholder="Descripción"
                name="description"
              />

              <View style={formR.customInput}>
                <Text style={formR.textCustomInput}>¿Es privada?</Text>
                <View
                  style={[formR.customInput, { width: "auto", marginLeft: 5 }]}
                >
                  <CheckBox
                    checked={select}
                    onPress={checker}
                    iconType="ionicon"
                    uncheckedIcon="radio-button-off-outline"
                    checkedIcon="radio-button-on-outline"
                    uncheckedColor="white"
                    checkedColor="#44ebdf"
                  />
                  <Text style={[formR.textCustomInput, { left: -12 }]}>Si</Text>
                </View>
                <View style={[formR.customInput, { width: "auto", left: -15 }]}>
                  <CheckBox
                    checked={!select}
                    onPress={checker}
                    iconType="ionicon"
                    uncheckedIcon="radio-button-off-outline"
                    checkedIcon="radio-button-on-outline"
                    uncheckedColor="white"
                    checkedColor="#44ebdf"
                  />
                  <Text style={[formR.textCustomInput, { left: -12 }]}>No</Text>
                </View>
              </View>

              {select ? (
                <TextInput
                  style={formR.inputs}
                  onChangeText={handleChange("secretKey")}
                  onBlur={handleBlur("secretKey")}
                  value={values.secretKey}
                  keyboardType="default"
                  secureTextEntry={true}
                  placeholder="Clave Secreta (5)"
                  name="secretKey"
                  maxLength={5}
                />
              ) : null}

              {select && values.secretKey === "" ? (
                <Text style={formR.error}>Por favor, ingrese una clave</Text>
              ) : null}
              {errors.secretKey && touched.secretKey && (
                <Text style={formR.error}>{errors.secretKey}</Text>
              )}

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("color")}
                onBlur={handleBlur("color")}
                value={values.color}
                keyboardType="default"
                placeholder="Color"
                name="color"
              />

              <TextInput
                style={formR.inputs}
                onChangeText={handleChange("img")}
                onBlur={handleBlur("img")}
                value={values.img}
                keyboardType="default"
                placeholder="Imagen (opcional)"
                name="img"
              />
              {
                <Image
                  style={{
                    marginTop: 20,
                    height: "15%",
                    backgroundColor: "transparent",
                    resizeMode: "center",
                  }}
                  source={{
                    uri:
                      values.img ||
                      "https://www.tibs.org.tw/images/default.jpg",
                  }}
                />
              }
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                style={formR.leagueFormBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={formR.colorTxtBtn}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[formR.leagueFormBtn, { backgroundColor: "#e69249" }]}
                onPress={handleSubmit}
              >
                <Text style={formR.colorTxtBtn}>CREAR</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>

      {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> : null}
      {/* <Button title="Cancelar" onPress={() => navigation.goBack()} /> */}
    </View>
  );
};

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}
    >
      <Stack.Screen name="Leagues" component={LeagueHome} />
      <Stack.Screen name="Create a league" component={HomeScreen} />
    </Stack.Navigator>
  );
}

const League = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default League;
