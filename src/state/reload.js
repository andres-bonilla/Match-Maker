import { createAction, createReducer } from "@reduxjs/toolkit"

export const reload = createAction( "RELOAD" )

export const reloadReducer = createReducer( false, { 
   [ reload ]: ( state, action ) => !state
} )