import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export const setUserMe = createAsyncThunk("ME", (userString) => {
    return axios.post(`${uri}/api/user/me`,{},{headers: {Authorization: `Bearer ${userString}`,},}).then((res) => res.data);
});

export const updateUser = createAsyncThunk("UPDATE_USER", ({values, id, userString}) => {
    return axios.put(`${uri}/api/user/edit/${id}`, values, {headers: {Authorization: `Bearer ${userString}`,},}).then(() => axios.post(`${uri}/api/user/me`,{},{headers: {Authorization: `Bearer ${userString}`,},}).then((res) => res.data))
});

const initialState = {};

const usersReducer = createReducer(initialState, {
    [setUserMe.fulfilled]: (state, action) => action.payload,
    [updateUser.fulfilled]: (state, action) => action.payload,
})

export default usersReducer