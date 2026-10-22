import React, { useState, useEffect, useRef} from "react";
import { getKintaiData, changeSect, subscribeToBackendUpdates } from "./utils/kintai.js";
import './App.css';
import Card from './components/Card/Card.js';
import Navbar from './components/Navbar/Navbar.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import Musen_sol from './musen.js';
import Sys_sol from "./system.js";
import ChartComponent from "./workInfo.js";
import Rd_zaseki from './zaseki.js';
import {Rd_zaseki_all} from "./zaseki_all.js";
import {Rd_zaseki_free} from "./zaseki_free.js";
import { GetWeatherNewsS, GetWeatherNewsK, GetWeatherNewsH, GetMessage, GetWeatherState } from './components/Contents/weather.js'
var init_no = 31
var initialURL = process.env.REACT_APP_BACKEND_URL + "31";
var backendURL = process.env.REACT_APP_BACKEND_URL
var team = init_no
var content_message = "";
var initialTab = 99
var initialTeam = 0

const FetchData = () => {  
  const [loading, setLoading] = useState(true);
  const [kintaiData, setKintaiData ] = useState([]);
  const [kintaiHistoryData, setKintaiHistoryData ] = useState([]);
  const [count, setCount] = useState(0);
  const [trip, setTrip] = useState(0);
  const [freeno, setFreeno] = useState(0);
  const [update, setUpdate] = useState(false);
  var upTime;
  //swiper
  const [swiper, setSwiper] = useState(null);
  const [value, setValue] = useState(0);
  const slideChange = (index) => {
    setValue(index);
    team = init_no + index;
    if (team === 39){
      team = 30;
    }
    //if (team === 38){
    //  team = 39;
    //}
    if (team === 40){
      team = 50;
    }
    if(index <= 9){
      initialURL = backendURL + team;
    }
    initialTab = 99;
    setCount(index)
    console.log(initialURL,index,team);
  };
  const tabChange = (event, newValue) => {
    setValue(newValue);
    swiper.slideTo(newValue);
  };

  // ここを修正
  useEffect(() => {

    const fetchKintaiData = async () => {
      if (initialTab !== 99){
        setValue(initialTab);
        slideChange(initialTab);
        console.log("slideChange",1);
        initialTab = 99;
      }

      //天気情報を取得
      var fuga = ""; //天気予報データ
      let res_s = await GetWeatherNewsS();
      let res_k = await GetWeatherNewsK();
      let res_h = await GetWeatherNewsH();
      let g_msg = await GetMessage();
      let weather = await GetWeatherState();
      fuga =  "今日の天気  " + res_s + res_k + res_h;

      if (weather === "we_off"){
        content_message = g_msg;
      } else {
        content_message = g_msg + fuga;
      }

      //出張者情報を取得
      var trip_url = process.env.REACT_APP_BACKEND_URL + "trip_info"
      let trip_res = await getKintaiData(trip_url);
      setTrip(trip_res)

      //勤怠データを取得
      if(team <= 39 || team === 50){
        let res = await getKintaiData(initialURL);
        console.log("URL1",initialURL,team);
        
        setKintaiData(res);
        
      };

      setLoading(false);
      setUpdate(false);

    };
    fetchKintaiData();

    return subscribeToBackendUpdates(fetchKintaiData);
  }, [count,update]);
   
  //勤怠カードクリック操作
  const pendingClickRef = useRef(null);
  useEffect(() => () => {
    if (pendingClickRef.current) {
      clearTimeout(pendingClickRef.current.timer);
    }
  }, []);

  const onDClick = (sect,n) => {
    const pendingClick = pendingClickRef.current;
    if (pendingClick && pendingClick.sect === sect && pendingClick.index === n) {
      clearTimeout(pendingClick.timer);
      pendingClickRef.current = null;
      doubleClick(sect,n);
      return;
    }

    if (pendingClick) {
      clearTimeout(pendingClick.timer);
      pendingClickRef.current = null;
      singleClick(pendingClick.sect,pendingClick.index);
    }

    const nextClick = { sect, index: n, timer: null };
    nextClick.timer = setTimeout(() => {
      if (pendingClickRef.current === nextClick) {
        pendingClickRef.current = null;
        singleClick(sect,n);
      }
    }, 400);
    pendingClickRef.current = nextClick;
  }
  const his_dialog = document.querySelector("#his_dialog");
  const singleClick = async (sect,n) => {
    try {
      console.log("シングルクリック!",n,sect,kintaiData[n].name.DisplayName);
      if (kintaiData[n].name === "None"){
        console.log("無効カード")
        return
      }
      var purl = backendURL + "history";
      const response = await fetch(purl,{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({name: kintaiData[n].name.DisplayName,sect:sect})
      });
      
      const data = await response.json();
      console.log(data)
      console.log(kintaiData[n].name.DisplayName)
      setKintaiHistoryData(data);
      //setKintaiData(data);
      his_dialog.showModal();
      setFreeno(n);
      return data;
    } catch (err) {
      alert(err)
    }
  }
  const onClickClose = () => {
    his_dialog.close();
  }
  
  const onSeatSet = async (kind) => {
    const seatParams = new URLSearchParams();
    seatParams.set("name", kintaiData[freeno].name.DisplayName);
    var result = kintaiData[freeno].team.Value.substr(0, 2);
    seatParams.set("sect", result);
    seatParams.set("set", kind);
    //doubleClick(result,freeno,"出社");
    if (kind === 'set'){
      var purl = backendURL + result;
      await fetch(purl,{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({num: freeno,state: "出社"})
      });
    }
    const url_string = `/seat_set?${seatParams.toString()}`;
    window.location.href = url_string;
  }

  const doubleClick = async (sect,n,st) => {
    try {
      console.log("ダブルクリック!",n,sect,st);
      var purl = backendURL + sect;
      var response;
      if (st === "出社"){
        response = await fetch(purl,{
          method: "POST",
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({num: n,state: st})
        });
      } else {
        response = await fetch(purl,{
          method: "POST",
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({num: n})
        });
      }

      const data = await response.json();
      //console.log(data)
      setKintaiData(data);
      return data;
    } catch (err) {
      alert(err)
    }
  }


  return (
    <>
      <Navbar title={'AIソリューション部　　勤怠状況'} sect={2}/>
      <div className="App">

        {loading ? (
          <>
          <h1>ロード中・・・</h1>
          <BrowserRouter>
          <Route path="/team/:id" component={Home} />
          </BrowserRouter>
          </>
        ) : (
          <>
            <div className="header2">    
            {
              (() => {
                if(team <= 39){
                  upTime = kintaiData[0].get_time
                } else {
                  upTime = kintaiData[0].get_time
                }
              })()
            }
            Teams同期時刻：{upTime}
            </div>
            <button className="chsect_button"  onClick={() => changeSect("/musen/11")}> ワイヤレス＆ネットワーク部 </button><div className="sectSpace">　</div>            
            <button className="chsect_button"  onClick={() => changeSect("/system/21")}> システムソリューション部 </button><div className="sectSpace">　</div>
            <button className="chsect_button"  onClick={() => changeSect("/team/31")}> AIソリューション部 </button><div className="sectSpace">　</div>
            <button className="chsect_button"  onClick={() => changeSect("/layout")}> 座席表 </button>
            <div className="header3">
              <Tabs value={value} onChange={tabChange} centered>
                <Tab label=<div className="header3">技術31課 </div> value={0} />
                <Tab label=<div className="header3">技術32課 </div> value={1} />
                <Tab label=<div className="header3">技術33課 </div> value={2} />
                <Tab label=<div className="header3">技術34課 </div> value={3} />
                <Tab label=<div className="header3">技術35課 </div> value={4} />
                <Tab label=<div className="header3">技術36課 </div> value={5} />
                <Tab label=<div className="header3">技術37課 </div> value={6} />
                <Tab label=<div className="header3">技術38課 </div> value={7} />
                <Tab label=<div className="header3">AI Sol </div> value={8} />
                <Tab label=<div className="header3">定禅寺オフィス </div> value={9} />
              </Tabs>

            </div>
            
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              initialSlide={initialTeam}
              onSlideChange={(index) => slideChange(index.activeIndex)}
              onSwiper={(swiper) => {
                const swiperInstance = swiper;
                setSwiper(swiperInstance);
              }}
            >
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (金沢)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("31",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (金沢)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("32",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainerJ">
                <h3 className="header">{team}課 (金沢)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係</h3>
                <h3 className="header">6係</h3>
                </div>
                <div className="kintaiCardContainerJ">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("33",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainerJ">
                <h3 className="header">{team}課 (浜松)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係</h3>
                <h3 className="header">ITS事業推進室2課</h3>
                </div>
                <div className="kintaiCardContainerJ">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("34",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (仙台)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("35",i)} key={i}><Card kintai={kintai} /> </button>;
                  
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (仙台)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("36",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (仙台)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("37",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team}課 (福岡)</h3>
                <h3 className="header" aria-hidden="true"></h3>
                <h3 className="header" aria-hidden="true"></h3>
                <h3 className="header" aria-hidden="true"></h3>
                <h3 className="header" aria-hidden="true"></h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("38",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">AI Sol</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("30",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                
                <div className="kintaiCardHeaderContainerJ2">
                <h3 className="header">35課</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係</h3>
                <h3 className="header">36課　4係</h3>
                <h3 className="header">36課　長期出張者</h3>
                </div>
                <div className="kintaiCardContainerJ2">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("50",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
                <div className="box2">
                <div className="left-box2">
                <p>定禅寺オフィス出張者情報</p>
                </div>
                <div className="slide-sample2">
                    <ul>
                    <li>{trip}</li>
                    </ul>    
                </div>
                </div>
              </SwiperSlide>
            </Swiper>


            <div className="box">
            <div className="left-box">
            <p>情報<span>Information</span></p>
            </div>
            <div className="slide-sample">
                <ul>
                <li>{content_message}</li>
                </ul>    
            </div>
            </div>
          </>
        )}
      </div>
      <dialog id="his_dialog">
        <div className="overlay">
          <div className="history_dialog">
            <p>{kintaiHistoryData["name"]}</p>
              <div className="history_dialog_history">
                {kintaiHistoryData["day1"]}<br></br>
                <div className="history_dialog2">
                  {kintaiHistoryData["day2"]}
                </div>
                {kintaiHistoryData["day3"]}<br></br>
                {kintaiHistoryData["day4"]}<br></br>
                {kintaiHistoryData["day5"]}<br></br>
              </div>
              <br></br>
            <button className="his_button_seat"  onClick={() => onSeatSet("set")}> フリー座席指定（兼 出社勤務） </button>
            <button className="his_button_seat"  onClick={() => onSeatSet("rel")}> フリー座席解除 </button>
            <br></br>
            <br></br>
            <button className="his_button_close"  onClick={() => onClickClose()}> 閉じる </button>
          </div>
          
        </div>
      </dialog>
    </>
  );
};

function Home(team) {
  const id = team.match.params.id;
  team = id;
  initialTab = team - init_no;

  if (team === "39"){
    initialTab = 7;
  }
  if (team === "30"){
    initialTab = 8;
  }
  initialTeam = initialTab;

  initialURL = backendURL + team;
  return <h2>Team {id}</h2>;
}

function Kintai() {
  return(
    <>
      <BrowserRouter>
      <Switch>
      <Route path="/layout/" component={Rd_zaseki_all} />
      <Route path="/musen/" component={Musen_sol} />
      <Route path="/team/" component={FetchData} />
      <Route path="/system/" component={Sys_sol} />
      <Route path="/zaseki/" component={Rd_zaseki} />
      <Route path="/chart/" component={ChartComponent} />
      <Route path="/set/" component={Info_set} />
      <Route path="/seat_set/" component={Rd_zaseki_free} />
      <Route path="/" component={FetchData} />
      </Switch>
      </BrowserRouter>
    </>
  );
}

var fuga = ""; //天気予報データ
var weather = "we_off";
var mess = "";
function Info_set() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  
  var purl = process.env.REACT_APP_BACKEND_URL + "content"  
  
  useEffect(() => {
    const fetchKintaiData = async () => {
      //天気情報を取得
      var fuga = ""; //天気予報データ
      let res_s = await GetWeatherNewsS();
      let res_k = await GetWeatherNewsK();
      let res_h = await GetWeatherNewsH();
      fuga =  "今日の天気  " + res_s + res_k + res_h;

      //設定済みメッセージ取得
      let g_msg = await GetMessage();
      setAddText(g_msg); 
      let weather = await GetWeatherState();

      if (weather === "we_off"){
        setAddTenki("天気：OFF");
      } else {
        setAddTenki("天気：ON");
      }
      mess = g_msg + fuga;
      setLoading(false);
    };
    fetchKintaiData();

    return subscribeToBackendUpdates(fetchKintaiData);
  }, []);

  /* ↓state変数「addText」を定義 */
  const [addText, setAddText] = useState("");
  const [addTenki, setAddTenki] = useState("");

  /* ↓関数onClickAddTextを定義 */
  const onClickAddText = async () => {
    setAddText(text);
    mess = addText
    switch (weather) {
      case 'we_on':
        setAddTenki("天気：ON");
          break;
      case 'we_off':
        setAddTenki("天気：OFF");
          break;
      default:
        setAddTenki("天気：ON");
    }

    try {
      await fetch(purl,{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({msg: text,tenki: weather})
      });
    } catch (err) {
      alert(err)
    }
  }
  const onClickDelText = async () => {
    setAddText("");
    mess = ""
    setText("");
    try {
      await fetch(purl,{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({msg: "",tenki: weather})
      });
    } catch (err) {
      alert(err)
    }
  }
  
  const [val, setVal] = React.useState("we_on");
  // 選択されたラジオボタンの値によって、文字列を返却する。
  const nowSelect = val => {
    let command = '';
    console.log("val=",val);
    switch (val) {
        case 'we_on':
          command = '';
            mess = fuga;
            weather = "we_on"
            break;
        case 'we_off':
            command = '';
            mess = ""
            weather = "we_off"
            break;
        default:
            command = '何も選択されていません。';
    }
    
    return command;
  };

  // ラジオボタンのイベントハンドラ
  const selectVal = e => setVal(e.target.value);

  return (
    <div className="App">
      {loading ? (
        <>
        <h1>ロード中・・・</h1>
        </>
      ) : (
        <>
          <h3 className="header">【スクロール情報設定画面】</h3>
          
          <div>
            <input type="radio" value="we_on" onChange={selectVal} checked={val === 'we_on'}/>天気予報　有
          </div>
          <div>
            <input type="radio" value="we_off" onChange={selectVal} checked={val === 'we_off'}/>天気予報　無
          </div>
          {nowSelect(val)}
          <p>編集中メッセージ：{text}</p>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          {/* ↓buttonを追加 */}          
          <button onClick={onClickAddText}>設定</button>
          <button onClick={onClickDelText}>削除</button><br></br><br></br>
          <Button variant="outlined" size="x-large" component={Link} to="/">戻る</Button>
          
          <h3 className="header"><br></br>現在の設定</h3>
          {/* ↓pタグを追加 */}
          <p>{addTenki}　設定済メッセージ：{addText}</p>
          <div className="box">
          <div className="left-box">
            <p>情報<span>Information</span></p>
            </div>
            <div className="slide-sample">
              <ul>
                <li>{addText + mess}</li>
              </ul>    
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default Kintai;