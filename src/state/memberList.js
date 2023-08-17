import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export const setMembers = createAsyncThunk("SET_MEMBERS", (leagueid) => {
  return axios
    .get(`${uri}/api/league/getUsers/${leagueid}`)
    .then((res) => res.data.rankedUsers);
});

export const addUserToLeague = createAsyncThunk(
  "ADD_USER_TO_LEAGUE",
  ({ ligueId, userData }) => {
    return axios
      .put(`${uri}/api/league/addUser/${ligueId}`, {
        userId: userData._id,
      })
    //   .then(() => axios.get(`${uri}/api/league/getUsers/${leagueid}`))
      .then((res) => {
          res.data
      });
  }
);

const initialState = [];

const membersReducer = createReducer(initialState, {
  [setMembers.fulfilled]: (state, action) => action.payload,
  [addUserToLeague.fulfilled]: (state, action) => [...state, action.payload],
});

export default membersReducer;
