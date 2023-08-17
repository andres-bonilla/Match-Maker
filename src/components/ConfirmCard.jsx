import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { leagueStyles } from "../styles/league";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";

const ConfirmCard = () => {
  const match = useSelector((state) => state.match);
  const user = useSelector((state) => state.user);
  const [isAccepted, setIsAccepted] = useState(false);

  const { manifest } = Constants;
  const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

  useEffect(() => {
    console.log("\n\n\nEsto es match\n\n\n\n", match)
    const equipos = match.invitations_team1.concat(match.invitations_team2);
    const arrayInvit = equipos.filter(
      (invitation) => invitation.toId === user._id
    );
    if (!arrayInvit[0]) return;
    if (arrayInvit[0].status === "accepted") setIsAccepted(true);
  }, [match]);

  const acceptHandler = () => {
    axios
      .put(`${uri}/api/invitation/invitAcepted/${match._id}/user/${user._id}`)
      .then(({ data }) => {
        setIsAccepted(true)
      });
  };

  return (
    <View style={{ flex: 1 /*backgroundColor: "blue"*/ }}>
      <View
        style={{
          height: 50,
          /*backgroundColor: "green",*/ alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 25, marginBottom: 8, color: "white" }}>
          Detalles del match
        </Text>
      </View>
      <View style={{ flex: 1 /*backgroundColor: "yellow"*/ }}>
        <View
          style={{ flex: 1, /*backgroundColor: "blue",*/ flexDirection: "row" }}
        >
          <View
            style={{
              flex: 1,
              /*backgroundColor: "grey",*/ alignItems: "center",
            }}
          >
            <Text style={{ marginVertical: 8, color: "white" }}>Equipo A</Text>
            <View style={{ flex: 1, alignItems: "center" }}>
              {match &&
                match.team_1.map((user) => {
                  return (
                    <Text style={{ color: "white" }}>{user.nickname}</Text>
                  );
                })}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              /*backgroundColor: "red",*/ alignItems: "center",
            }}
          >
            <Text style={{ marginVertical: 8, color: "white" }}>Equipo B</Text>
            <View style={{ flex: 1, alignItems: "center" }}>
              {match &&
                match.team_2.map((user, i) => {
                  return (
                    <Text style={{ color: "white" }} key={i}>{user.nickname}</Text>
                  );
                })}
            </View>
          </View>
        </View>

        <Text style={{ paddingHorizontal: 8, marginTop: 12, color: "white" }}>
          El partido se disputara el{" "}
          {moment(match.date, "DD-MM-YYYY").format("DD [de] MMMM [de] YYYY")} a
          las {match.time}
        </Text>
        <View style={{ height: "auto", marginTop: 16, borderRadius: 10 }}>
          <Text>Descripcion</Text>
        </View>
      </View>
      <View style={{ height: 115 }}>
        {!isAccepted ? (
          <TouchableOpacity
            style={[leagueStyles.join, { backgroundColor: "#16a085" }]}
            onPress={acceptHandler}
          >
            <Text style={leagueStyles.joinTxt}>Confirmar participación</Text>
          </TouchableOpacity>
        ) : (
          <Text style={leagueStyles.joinTxt}>
            Ya has confirmado tu participación
          </Text>
        )}
      </View>
    </View>
  );

  // return(

  //    <View style={{ flex: 1, backgroundColor: "blue"}} >
  //       <View style={{ height: 50, backgroundColor: "green", alignItems: "center", justifyContent: "center"}} >
  //          <Text>
  //             Detalles del match
  //          </Text>
  //       </View>

  //       <View style={{ flex: 1, backgroundColor: "yellow"}} >
  //          <View style={{ flex: 1, backgroundColor: "blue", flexDirection: "row"}} >
  //             <View style={{ flex: 1, backgroundColor: "grey", alignItems: "center"}} >
  //                <Text style={{ marginVertical: 8}}>Equipo A</Text>

  //                <View style={{flex: 1, alignItems: "center"}}>
  //                                {match && match.team_1.map( user => {
  //                                  return (
  //                                     <Text>{user.nickname}</Text>)
  //                               })}
  //                </View>
  //             </View>

  //             <View style={{ flex: 1, backgroundColor: "red", alignItems: "center"}} >
  //                <Text style={{ marginVertical: 8}}>Equipo B</Text>

  //                <View style={{flex: 1, alignItems: "center"}}>
  //                               {match && match.team_2.map( user => {
  //                                  return (
  //                                     <Text>{user.nickname}</Text>)
  //                               })}
  //                </View>
  //             </View>
  //          </View>

  //          <Text>
  //             El partido se disputara el {moment(match.date, "DD-MM-YYYY").format("DD [de] MMMM [de] YYYY")} a las {match.time}
  //          </Text>

  //          <View style={{ height: 84, marginTop: 16, borderRadius: 10}}>
  //             <Text>Descripcion</Text>
  //          </View>
  //       </View>

  //       <View style={{ height: 115, backgroundColor: "red"}} >
  //          <TouchableOpacity style={[leagueStyles.join, {backgroundColor:"#16a085"}]}
  //                   >
  //             <Text style={leagueStyles.joinTxt}>Boton confirm ocultable</Text>
  //          </TouchableOpacity>
  //       </View>
  //    </View>
  // )
};

export default ConfirmCard;



/*<Modal animationType="fade" transparent={true} visible={showCard}>
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
                      {leagueList.map((item, i) => {
                        return (
                          <TouchableOpacity
                            style={{ margin: 7 }}
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
                      })}
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
        style={[leagueStyles.head, { backgroundColor: actualleague.color }]}
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: actualleague.img }}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={[
              leagueStyles.menu,
              { alignSelf: "flex-end", justifyContent: "center" },
            ]}
            onPress={() => setShowCard(true)}
          >
            <Icon
              name="caret-down-circle"
              type="ionicon"
              color="green"
              size={32}
            />
          </TouchableOpacity>

          <View style={leagueStyles.info}>
            <Text style={leagueStyles.title}>{actualleague.name}</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={leagueStyles.body}>
        <View style={leagueStyles.listHead}>
          <View style={leagueStyles.enum}>
            <View
              style={{ width: 50, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}>Rank</Text>
            </View>

            <View
              style={{ width: 50, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}></Text>
            </View>

            <View
              style={{
                flex: 1,
                width: "auto",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>Nick</Text>
            </View>

            <View
              style={{ width: 100, alignItems: "center", marginVertical: 5 }}
            >
              <Text style={{ color: "#FFFFFF" }}>ELO</Text>
            </View>
          </View>
        </View>

        <List list={memberList} Element={ItemLeague} />

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
          userData.rank > 1 ? (
            <View style={leagueStyles.foot}>
              <View style={leagueStyles.user}>
                <View style={leagueStyles.rank}>
                  <Text style={{ color: "#FFFFFF" }}>{user.rank}</Text>
                </View>
                <View
                  style={[leagueStyles.img, { backgroundColor: user.color }]}
                ></View>
                <View style={leagueStyles.nick}>
                  <Text style={{ color: "#FFFFFF" }}>{user.nickname}</Text>
                </View>
                <View style={leagueStyles.elo}>
                  <Text style={{ color: "#FFFFFF" }}>{user.elo}</Text>
                </View>
              </View>
            </View>
          ) : (
            <></>
          )
        ) : (
          <View style={[leagueStyles.foot, { height: 100 }]}>
            <TouchableOpacity
              style={[leagueStyles.join, { backgroundColor: "#16a085" }]}
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
        )}
      </View> */
