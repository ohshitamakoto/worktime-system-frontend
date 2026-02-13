import React from "react";
import "./Seat.css"

const Seat = ({seat}) => {

    var name = seat.name
    var state = seat.state
    var substate = seat.substate
    var sect = seat.sect
    if(state != null && state.indexOf("*") > -1){
        state = "";
    }
    return (
        <div className={name === "通路" ? "seatBlank": name === "柱" ? "pillar" :
        sect === 31 ? "seat35" :
        sect === 32 ? "seat36" :
        sect === 33 ? "seat33" :
        sect === 35 ? "seat35" :
        sect === 36 ? "seat36" :
        sect === 37 ? "seat37" :
        sect === 39 ? "seat11" :
        sect === 11 ? "seat11" :
        sect === 15 ? "seat15" :
        sect === 21 ? "seat35" :
        sect === 14 ? "seat37" :
        sect === 0 ? "posi" :
        sect === 1 ? "phone" :
        name === "試験中" ? "sensor" :
        "seat"}>
          <h3 className={name === "通路" ? "seatBlank" : "seatName"}>{name}</h3>

          <h3 className={state === "年休" ? "cardState2":
          state === "終了" ? "cardState1_2" :
          state === "退勤" ? "cardState1_2" :
          ( state.indexOf('年休') !== -1)  ? "cardState2" :
          ( state.indexOf('終了') !== -1)  ? "cardState1_2" :
          ( state.indexOf('退勤') !== -1)  ? "cardState1_2" :
          ( state.indexOf('在宅') !== -1)  ? "cardState1_1" :
          ( state.indexOf('出張') !== -1)  ? "cardState1_3" :
          ( state.indexOf('出社') !== -1)  ? "cardState1" :
           "seatTime"}>{state}</h3>
          <h2 className={(substate.indexOf('内線') !== -1) ? "cardState1_4" :
          substate !== "-" ? "seatTime2" :
          "seatTime"}>{substate}</h2>
        </div>
      )
};

export default Seat;