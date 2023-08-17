import { createAction, createReducer } from "@reduxjs/toolkit";

export const setLeagueId = createAction("SETLEAGUEID");

export const leagueIdReducer = createReducer("", {
  [setLeagueId]: (state, action) => action.payload,
});
