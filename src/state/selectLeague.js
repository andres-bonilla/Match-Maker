import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export const setLeague = createAsyncThunk("SET_LEAGUE", (league) => league);

const initialState = {};

const selectLeaguesReducer = createReducer(initialState, {
  [setLeague.fulfilled]: (state, action) => action.payload,
});

export default selectLeaguesReducer;
