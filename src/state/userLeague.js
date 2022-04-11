import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export const setUserLeagues = createAsyncThunk("USER_LEAGUES", ({userId}) => {
    return axios.get(`${uri}/api/user/getLeagues/${userId}`).then((res) => res.data);
});

const initialState = [];

const userLeaguesReducer = createReducer(initialState, {
    [setUserLeagues.fulfilled]: (state, action) => {
        console.log(`Setee user leagues con action.payload`);
        return action.payload},
})

export default userLeaguesReducer