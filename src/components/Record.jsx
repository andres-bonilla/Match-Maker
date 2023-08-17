import moment from 'moment';
import 'moment/locale/es'

import React, { useEffect, useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Pressable,
  ScrollView  
} from "react-native";
import CalendarStrip from 'react-native-calendar-strip'
import { Icon } from "react-native-elements";

import Constants from "expo-constants";

import List from "../commons/List";
import ItemRecord from "./ItemRecord";

import { recordStyles, cardStyles } from "../styles/record";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ConfirmCard from './ConfirmCard';
import { setMatch } from '../state/record';
import ListHead from "./MatchListHead";
import { colorSet } from "../styles/colorSet";

const Record = () => {
   let [recordList, setRecordList] = useState([])
   let [onDate, setOnDate] = useState(moment())
   let [showAll, setShowAll] = useState(false)
   let [dotList, setDotList] = useState([])

    const { manifest } = Constants
    const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`      
    
    const dispatch = useDispatch();

    const user= useSelector( state => state.user)
    const match = useSelector( state => state.match)


    useEffect(()=>{
      axios.get(`${uri}/api/user/getMatches/${user._id}`)
      .then(({data}) => {
          setRecordList(data.reverse())
          setDotList(data)
      })
      setOnDate(moment())
    },[showAll])



    const matchDateHandler = matchDate => {
      axios.get(`${uri}/api/user/${user._id}/getMatchesByDate/${matchDate}`)
      .then(({data}) => {
          setRecordList(data.reverse())
      })
    }
    
   return (
      <SafeAreaView style= {recordStyles.back}>
         <View style={[recordStyles.head]}>
            <View style={recordStyles.info}>
               <Text style={recordStyles.title}>Historial</Text>
            </View>
               
            <View style={[recordStyles.calendar]}>
               <CalendarStrip
                  style={{height:110, paddingTop: 5}}
                  scrollable
                  iconContainer={{flex: 0.1}}
                  iconStyle={{}}
                  calendarHeaderStyle={{color: colorSet.text, fontSize: 15}}
                  dateNumberStyle={{color: colorSet.text, fontSize: 14}}
                  dateNameStyle={{color: colorSet.text}}
                  highlightDateNameStyle={{fontSize: 0}}
                  highlightDateNumberStyle={{color: colorSet.content , fontSize: 18}}
                  highlightDateContainerStyle={{backgroundColor: colorSet.text}}
                  locale={ {name: "es", config: {
                     months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
                     weekdaysShort: 'DOM_LUN_MAR_MIE_JUE_VIE_SAB'.split('_'),}}}
                  minDate={moment("01-01-2022", "MM-DD-YYYY")}
                  maxDate={moment().add(6, "M")}
                  startingDate={moment().subtract(3, 'd')}
                  markedDates = {dotList && dotList[0]? dotList.map( item =>{
                         return {
                           date: moment(item.date, "DD-MM-YYYY"),
                           dots: [ { color: colorSet.text } ]
                         }
                        }):[]}

                  selectedDate={onDate}
                  onDateSelected={ selected => {
                     matchDateHandler(moment(selected, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("DD-MM-YYYY"))
                     setOnDate(moment(selected, "YYYY-MM-DDTHH:mm:ss.SSSZ"))
                  } }
                  
               />
               
               <TouchableOpacity onPress={()=> setShowAll(!showAll)} style={recordStyles.show}>
                  <Text style={recordStyles.showTxt} >Mostrar todo</Text>
               </TouchableOpacity>
            </View>
         </View>
               
         <View style={recordStyles.body}>
            
            <ListHead labels={["Aliados", "Info", "Rivales"]} styling={recordStyles.listHead}/>
               
            <View style={recordStyles.list}>
              {!!recordList.length && <List list={recordList} Element={ItemRecord} marginNum={0.1} />}
            </View>

         </View>
      
         <Modal animationType="fade" transparent={true}
            onRequestClose={() => setShowCard(!showCard) }
            visible={false && match && match.id}
         >
            <View style={cardStyles.back}>
               <View>
                  <ScrollView>
                     <View style={cardStyles.body}>
                        <Pressable onPress={() => { dispatch(setMatch(null)) }} style={cardStyles.closeButton} >
                           <Icon name="close-circle" type="ionicon" color="red" />
                        </Pressable>
                  
                        <View style={{ flex: 1}} >
                           
                           <ConfirmCard/>

                        </View>
            
                     </View>
                  </ScrollView>
               </View>
            </View>
         </Modal>
      </SafeAreaView>
    );
  }

export default Record

{/*
<View style={[recordStyles.head]}>
            
            <View style={recordStyles.info}>
               <Text style={recordStyles.title}>Historial</Text>
            </View>

            <View style={[recordStyles.calendar]}>
            <CalendarStrip
                     scrollable
                     iconContainer={{flex: 0.1}}
                     style={{height:110, paddingTop: 20, paddingBottom: 5}}
                     iconStyle={{backgroundColor: 'white'}}
                     highlightDateNameStyle={{color: 'red'}}
                     highlightDateNumberStyle={{color: 'red'}}
                     calendarHeaderStyle={{color: 'white'}}
                     dateNumberStyle={{color: 'white'}}
                     dateNameStyle={{color: 'white'}}
                     locale={ {name: "es", config: {
                        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
                        weekdaysShort: 'DOM_LUN_MAR_MIE_JUE_VIE_SAB'.split('_'),}}}
                     minDate={moment("01-01-2022", "MM-DD-YYYY")}
                     maxDate={moment().add(6, "M")}
                     selectedDate={onDate}
                     onDateSelected={ selected => {
                        matchDateHandler(moment(selected, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("DD-MM-YYYY"))
                        setOnDate(moment(selected, "YYYY-MM-DDTHH:mm:ss.SSSZ"))
                     } }
                     markedDates = 
                     {recordList.map( item =>{
                      return {
                        date: moment(item.date, "DD-MM-YYYY"),
                        lines: [ { color: "red" } ]
                      }
                     })}
                  />
            </View>

            <TouchableOpacity  onPress={()=> setShowAll(!showAll)} style={{ height: 50, alignItems: "center", justifyContent: "center"}}>
              <Text style={{ color: "#FFFFFF" }}>Mostrar todo</Text>
            </TouchableOpacity>
         </View>

        <View style={recordStyles.body}>
          <View style={[recordStyles.listHead]}>
            <View style={recordStyles.enum}>
              <View style={{ width: 50, alignItems: "center", marginVertical: 5 }}>
                <Text style={{ color: "#FFFFFF" }}>Fecha</Text>
              </View>
              <View style={{ width: 50, alignItems: "center", marginVertical: 5 }}>
                <Text style={{ color: "#FFFFFF" }}></Text>
              </View>
              <View style={{ flex: 1, width: "auto", alignItems: "center", marginVertical: 5 }} >
                <Text style={{ color: "#FFFFFF" }}>Grupo</Text>
              </View>
              <View style={{ width: 100, alignItems: "center", marginVertical: 5 }} >
                <Text style={{ color: "#FFFFFF" }}>Resultado</Text>
              </View>
            </View>
          </View>
             
          <List list={recordList} Element={ItemRecord} />
    /*      
          <FootLigue ligueId={state.params._id} userData={user} /> 
          </View>

          <Modal
             animationType="fade"
             transparent={true}
             visible={match && match.id}
             onRequestClose={() => {
               dispatch(setMatch(null)) 
             }}
          >
             <View style={{
                height: "100%",  
                backgroundColor: 'rgba(30,30,50,0.85)',
                justifyContent: "flex-end"}}>
                
                <View>
                   <ScrollView>
                      <View style={{
                         flex: 1,
                         marginHorizontal: 16,
                         backgroundColor: "#0e0b29", 
                         paddingHorizontal: 8,
                         borderTopRightRadius: 10,
                         borderTopLeftRadius: 10 }}>
                
                       <Pressable style={{marginTop: 10, alignItems: "flex-end"}} 
                         onPress={() => {
                           dispatch(setMatch(null)) 
                         }} >
                         <Icon name="close-circle" type="ionicon" color="red" />
                       </Pressable>
 
                       <ConfirmCard/>
                   
                         
             
                      </View>
                   </ScrollView>
                </View>
             </View>
          </Modal>
*/ }