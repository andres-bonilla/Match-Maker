import { createAction, createReducer } from "@reduxjs/toolkit"

export const setMatch = createAction( "SETMATCH" )

export const matchReducer = createReducer( null, { 
   [ setMatch ]: ( state, action ) => action.payload
} )