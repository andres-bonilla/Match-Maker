import { createAction, createReducer } from "@reduxjs/toolkit"

export const resetChecks = createAction( "RESETCHECKS" )

export const checksReducer = createReducer( false, { 
   [ resetChecks ]: ( state, action ) => !state
} )