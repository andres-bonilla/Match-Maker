import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "@rneui/themed";
import { FlatGrid } from "react-native-super-grid";
import axios from "axios";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { setUserMe } from "../state/user";
import { setUserLeagues } from "../state/userLeague";
import { setLeagues } from "../state/league";
import { setLeague } from "../state/selectLeague";
import { setMembers } from "../state/memberList";
import { setLeagueId } from "../state/idLeague";
import ItemRecord from "./ItemRecord";

const screen = Dimensions.get("screen");

const home = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  tittle: {
    marginTop: 70,
    alignItems: "center",
  },
  tittleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  containerDos: {
    marginTop: 20,
    height: "25%",
  },
  lastTittle: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 20,
    color: "white",
  },
  lastContainer: {
    backgroundColor: "#53525d",
    alignSelf: "center",
    flexDirection: "row",
    width: "80%",
    height: "40%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 5,
  },
  lastResultItem: {
    height: "100%",
    justifyContent: "center",
    width: "33%",
    backgroundColor: "#808080",
    flexDirection: "column",
  },
  lastResult: {
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
  },
  lastItem: {
    width: "33%",
    flexDirection: "column",
  },
  lastText: {
    width: "100%",
    height: "33%",
    textAlign: "center",
    color: "#FFFFFF",
  },
  ligaContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  ligaTittle: {
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
    textAlign: "center",
    width: "50%",
  },
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 120,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "900",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
});

function Home({ navigation: { navigate } }) {
  const { manifest } = Constants;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userLeagues = useSelector((state) => state.userLeagues);
  const leagues = useSelector((state) => state.leagues);

  const [search, setSearch] = useState("");
  const [meLeagues, setMeLeagues] = useState(false);
  const [results, setResults] = useState({});
  const [matches, setMatches] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [select, setSelect] = useState();
  const [selectMeLeagues, setSelectMeLeagues] = useState({ color: "#39424d" });

  const [openedMatch, setOpenedMatch] = useState(false);

  const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;
  const match = matches.reverse()[0];

  const updateSearch = (search) => {
    if (!search) setResults([]);
    setSearch(search);
    if (!search) return;
    axios.get(`${uri}/api/league/findLeague/${search}`).then(({ data }) => {
      setResults(data);
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(async () => {
    try {
      const userString = await AsyncStorage.getItem("userInfo");
      if (!userString) return;
      const result = await dispatch(setUserMe(userString));
      const userLeagues = await dispatch(
        setUserLeagues({ userId: result.payload._id })
      );
      const { payload } = await dispatch(setLeagues(false));
      const { data } = await axios.get(
        `${uri}/api/user/getMatches/${result.payload._id}`
      );
      setMatches(data);
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  return (
    <View style={home.container}>
      <StatusBar style="light" />
      <View style={home.tittle}>
        <Text style={home.tittleText}>MATCH MAKER</Text>
      </View>
      <View style={home.containerDos}>
        {isKeyboardVisible ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            ────────────────Search────────────────
          </Text>
        ) : (
          <>
            {/* <Text style={home.lastTittle}>Ultima partida</Text> */}
            {matches.reverse()[0] ? (
              <View
                onPress={() => console.log(`esto es magia`)}
                
                style={{ marginTop: openedMatch? 100 : 20 }}
              >
                <ItemRecord
                  item={matches.reverse()[0]}
                  setOpenedMatch={setOpenedMatch}
                  openedMatch={openedMatch}
                />
              </View>
            ) : (
              // <TouchableOpacity
              //   style={home.lastContainer}
              //   onPress={() => {
              //     navigate("Historial");
              //   }}
              // >
              //   <View style={home.lastItem}>
              //     {match.team_1.map((item, i) => {
              //       if (i == 2)
              //         return (
              //           <Text key={i} style={home.lastText}>{`y ${
              //             match.team_1.length - 2
              //           } más`}</Text>
              //         );
              //       if (i > 1) return;
              //       return (
              //         <Text key={i} style={home.lastText}>
              //           {item.nickname}
              //         </Text>
              //       );
              //     })}
              //   </View>
              //   <View style={home.lastResultItem}>
              //   <Text style={home.lastResult}>{match.date}</Text>
              //     <Text style={home.lastResult}>{match.status}</Text>
              //   </View>
              //   <View style={home.lastItem}>
              //     {match.team_2.map((item, i) => {
              //       if (i == 2)
              //         return (
              //           <Text key={i} style={home.lastText}>{`y ${
              //             match.team_2.length - 2
              //           } más`}</Text>
              //         );
              //       if (i > 1) return;
              //       return (
              //         <Text key={i} style={home.lastText}>
              //           {item.nickname}
              //         </Text>
              //       );
              //     })}
              //   </View>
              // </TouchableOpacity>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  alignSelf: "center",
                }}
              >
                Aun no tienes matches registradas
              </Text>
            )}
          </>
        )}
        {!openedMatch ? (
          <>
            <View style={{ marginTop: 10 }}>
              <SearchBar
                placeholder="Escribe aca..."
                onChangeText={updateSearch}
                value={search}
                lightTheme={true}
                containerStyle={{
                  backgroundColor: "#0e0b29",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent",
                }}
                round={true}
                onClear={() => setResults([])}
                onCancel={() => setResults([])}
              />
            </View>
          </>
        ) : null}
      </View>
      {!openedMatch ? (
        <>
          {results[0] ? (
            <>
              <View style={[home.ligaContainer, { marginTop: 80 }]}>
                <Text style={[home.ligaTittle, { width: "100%" }]}>
                  RESULTADO
                </Text>
              </View>
              <Text style={{ color: "white", textAlign: "center" }}>
                ──────────────────────────────────────
              </Text>
              <FlatGrid
                style={home.gridView}
                itemDimension={120}
                data={results}
                // staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setLeagueId(item._id));
                      dispatch(setLeague(item));
                      dispatch(setMembers(item._id));
                      navigate("Liga", item);
                    }}
                    style={[
                      home.itemContainer,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                      <Image
                        source={{
                          uri: item.img
                            ? item.img
                            : "https://trome.pe/resizer/G8-kkwwutkrNacKh5S6TJplAluU=/980x0/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/OXHJSIF4SZDAJP6F5PHFZTLRYI.jpg",
                        }}
                        resizeMode="cover"
                        style={{ height: "100%" }}
                      />
                    </View>
                    <Text style={home.itemName}>{item.name}</Text>
                    <Text style={home.itemCode}>{item.sport}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <>
              <View style={[home.ligaContainer, { marginTop: 80 }]}>
                <Text
                  style={[home.ligaTittle, select]}
                  onPress={() => {
                    setSelect({ color: "white" });
                    setSelectMeLeagues({ color: "#39424d" });
                    setMeLeagues(false);
                  }}
                >
                  LIGAS
                </Text>
                <Text
                  style={[home.ligaTittle, selectMeLeagues]}
                  onPress={() => {
                    setSelectMeLeagues({ color: "white" });
                    setSelect({ color: "#39424d" });
                    setMeLeagues(true);
                  }}
                >
                  TUS LIGAS
                </Text>
              </View>
              <Text style={{ color: "white", textAlign: "center" }}>
                ──────────────────────────────────────
              </Text>
              {meLeagues ? (
                <FlatGrid
                  style={home.gridView}
                  itemDimension={120}
                  data={userLeagues}
                  spacing={10}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setLeagueId(item.league._id));
                        dispatch(setLeague(item));
                        dispatch(setMembers(item.league._id));
                        navigate("Liga");
                      }}
                      style={[
                        home.itemContainer,
                        { backgroundColor: item.league.color },
                      ]}
                    >
                      <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <Image
                          source={{
                            uri: item.league.img
                              ? item.league.img
                              : "https://trome.pe/resizer/G8-kkwwutkrNacKh5S6TJplAluU=/980x0/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/OXHJSIF4SZDAJP6F5PHFZTLRYI.jpg",
                          }}
                          resizeMode="cover"
                          style={{ height: "100%" }}
                        />
                      </View>
                      <Text style={home.itemName}>{item.league.name}</Text>
                      <Text style={home.itemCode}>{item.league.sport}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <FlatGrid
                  style={home.gridView}
                  itemDimension={120}
                  data={leagues}
                  spacing={10}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setLeagueId(item._id));
                        dispatch(setLeague(item));
                        dispatch(setMembers(item._id));
                        navigate("Liga", item);
                      }}
                      style={[
                        home.itemContainer,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <Image
                          source={{
                            uri: item.img
                              ? item.img
                              : "https://trome.pe/resizer/G8-kkwwutkrNacKh5S6TJplAluU=/980x0/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/OXHJSIF4SZDAJP6F5PHFZTLRYI.jpg",
                          }}
                          resizeMode="cover"
                          style={{ height: "100%" }}
                        />
                      </View>
                      <Text style={home.itemName}>{item.name}</Text>
                      <Text style={home.itemCode}>{item.sport}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}
        </>
      ) : null}
    </View>
  );
}

export default Home;
