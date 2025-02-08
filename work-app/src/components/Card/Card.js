import React from "react";
import "./Card.css"

const Card = ({kintai}) => {
  //氏名
  var name = kintai.name.DisplayName

  //出社形式
  var state = kintai.state.Value
  var name_state = ""
  var push_state = "off"
  if(state != null){
    name_state = state
    if( name_state.indexOf('出社勤務中') !== -1){
      push_state = "on"
    }
    if( name_state.indexOf('退勤') !== -1){
      push_state = "on"
    }
  }
  var l_state = ""
  if(state != null && state.indexOf("在宅") > -1){
    l_state = "在宅"
    if(state.indexOf("終了") > -1){
      l_state = "終了"
    }
  }
  if(state != null && state.indexOf("出張") > -1){
    l_state = "出張"
  }
  //部分休
  var sub_state = kintai.time_off.Value
  var temp_sub_state = kintai.time_off.Value
  //複数の場合
  if(temp_sub_state != null && temp_sub_state.indexOf("、") > -1){
    var temp_str = temp_sub_state.split('、');
    console.log(temp_str);
  }

  //勤怠時間判定
  var disp_time = "-"
  var start_time = kintai.work_s_time
  var end_time = kintai.work_e_time
  if(start_time !== null){
    //console.log(start_time)
    if(start_time !== ""){
      disp_time = start_time + "～" + end_time
    }
  }else{
    disp_time = "*"
  }

  //部分在宅があれば勤務時間後半に追加
  var disp_time_off = "*"
  start_time = ""
  end_time = ""
  if(kintai.home_s_time !== null){
    start_time = kintai.home_s_time;
  }
  if(kintai.home_e_time !== null){
    end_time = kintai.home_e_time;
  }

  if(state != null && state.indexOf("部分") > -1){
    disp_time_off = "（部分在宅：" + start_time + "～" + end_time + "）";
  }

  var main_state = "無し"
  if(state != null && state.indexOf("年休") > -1){
    main_state = "年休";
  }

  return (
    <div className={disp_time === "*" ? "cardBlank": "card"}>
      <h3 className={( name_state.indexOf('出社勤務中') !== -1) ? "cardName1":
                     ( name_state.indexOf('退勤') !== -1) ? "cardName2":
                      "cardName"}>{name}</h3>
      
      <h3 className={state === "年休" ? "cardState2":
                     ( main_state.indexOf('年休') !== -1)  ? "cardState2" : 
                    push_state === "on" ? "card_State1" :
                    l_state === "終了" ? "cardState1_2" :
                    l_state === "在宅" ? "cardState1_1" :
                     ( l_state.indexOf('退勤') !== -1)  ? "cardState1_2" : 
                     ( l_state.indexOf('出張') !== -1)  ? "cardState1_3" : 
                     
                    "card_State1_1"}>{state}</h3>
      <h3 className={sub_state === "無" ? "cardState4": "cardState3"}>{sub_state}</h3>
      <h2 className="cardTime">{disp_time}</h2>
      <h2 className="cardTime">{disp_time_off === "*" ? "":disp_time_off}</h2>
    </div>
  )
};

export default Card;