import { createAction, createReducer } from "@reduxjs/toolkit"

export const setTeam = createAction( "ADDTEAM" )
export const removeTeam = createAction( "DELTEAM" )
export const resetTeams = createAction( "RESET" )

const initial = { "teamA": [], "teamB": [] }

export const teamsReducer = createReducer( initial, { 
   [ setTeam ]: ( state, action ) => {
         const {team, id, nick} = action.payload
         state[team] = [...state[team], {id: id, nick: nick}]
         
         const otherTeam = team === "teamA" ? "teamB" : "teamA"
         state[otherTeam] = [...state[otherTeam]].filter( item => item.id !== id)
         return state
      },
   [ removeTeam ]: ( state, action ) => {
         const {team, id} = action.payload
         state[team] = [...state[team]].filter( item => item.id !== id)
         return state
      },
   [ resetTeams ]: ( state, action ) => initial
} )