import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export const setLeagues = createAsyncThunk("GET_LEAGUES", (isPrivate) => {
  return axios.get(`${uri}/api/league/getAll/private/${isPrivate}`).then((res) => res.data);
});

const initialState = [];

const leaguesReducer = createReducer(initialState, {
  [setLeagues.fulfilled]: (state, action) => action.payload,
});

export default leaguesReducer;
