import React, { useState, useEffect} from "react";
import { getKintaiData } from "./utils/kintai.js";
import './App.css';
import Card from './components/Card/Card.js';
import Navbar from './components/Navbar/Navbar.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import { GetWeatherNewsS, GetWeatherNewsK, GetWeatherNewsH, GetMessage, GetWeatherState } from './components/Contents/weather.js'
var init_no_m = 21
var initialURL_m = "http://hoya.pmcrd.mei.co.jp:5001/21";
var backendURL = "http://hoya.pmcrd.mei.co.jp:5001/"
var team_w = init_no_m
var initialTab_m = 99
var initialTeam_m = 0
var message = ""

const Sys_sol = () => {  
  const [loading, setLoading] = useState(true);
  const [kintaiData, setKintaiData ] = useState([]);
  const [count, setCount] = useState(0);
  const [update, setUpdate] = useState(false);
  var upTime;

  //swiper
  const [swiper, setSwiper] = useState(null);
  const [value, setValue] = useState(0);

  const slideChange = (index) => {
    console.log(initialURL_m,index,team_w);
    setValue(index);
    team_w = init_no_m + index;
    if (team_w === 25){
      team_w = 20;
    }

    initialURL_m = backendURL + team_w;

    initialTab_m = 99;
    setCount(index)
    console.log(initialURL_m,index);
  };
  const tabChange = (event, newValue) => {
    setValue(newValue);
    swiper.slideTo(newValue);
  };

  // ここを修正
  useEffect(() => {

    const fetchKintaiDataM = async () => {
      if (initialTab_m !== 99){
        setValue(initialTab_m);
        console.log("slideChange0",1,initialTab_m);
        slideChange(initialTab_m);
        initialTab_m = 99;
      }

      //勤怠データを取得
      if(team_w <= 24){
        let res = await getKintaiData(initialURL_m);
        
        console.log("URL1",initialURL_m,team_w);
        setKintaiData(res);
      };

      //天気情報を取得
      var fuga = ""; //天気予報データ
      let res_s = await GetWeatherNewsS();
      let res_k = await GetWeatherNewsK();
      let res_h = await GetWeatherNewsH();
      let g_msg = await GetMessage();
      let weather = await GetWeatherState();
      fuga =  "今日の天気  " + res_s + res_k + res_h;

      if (weather === "we_off"){
        message = g_msg;
      } else {
        message = g_msg + fuga;
      }

      setLoading(false);
      setUpdate(false);
    };
    fetchKintaiDataM();

    const interval = setInterval(() => {
      fetchKintaiDataM();
    }, 350000);

    return () => clearInterval(interval);
  }, [count,update]);
   
  //勤怠カードクリック操作
  let clickCount = 0;
  const onDClick = (sect,n) => {
    clickCount++;
    if (clickCount < 2) {
      setTimeout(() => {
        if (1 < clickCount) {
          doubleClick(sect,n);
        }
        clickCount = 0;
      }, 500);
    }
  }
  const doubleClick = async (sect,n) => {
    try {
      console.log("クリック!",n,sect);
      var purl = backendURL + sect;
      const response = await fetch(purl,{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({num: n})
      });
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
      <Navbar title={'システムソリューション部　　勤怠状況'} sect={1}/>
      <div className="App">

        {loading ? (
          <>
          <h1>ロード中・・・</h1>
          <BrowserRouter>
          <Route path="/system/:id" component={Home_system} />
          </BrowserRouter>
          </>
        ) : (
          <>
            <div className="header2">
            {
              (() => {
                upTime = kintaiData[0].get_time
              })()
            }
            Teams同期時刻：{upTime}
            </div>

            <Button variant="outlined" size="x-large" component={Link} to="/musen/11">無線ソリューション部</Button>
            <div className="sectSpace">　</div>
            <Button variant="outlined" size="x-large" component={Link} to="/system/21">システムソリューション部</Button>
            <div className="sectSpace">　</div>
            <Button variant="outlined" size="x-large" component={Link} to="/team/31">AIソリューション部</Button>
            <div className="sectSpace">　</div>
            <Button variant="outlined" size="x-large" component={Link} to="/layout">座席表</Button>

            <div className="header3">
              <Tabs value={value} onChange={tabChange} centered>
                <Tab label=<div className="header3">技術21課 </div> value={0} />
                <Tab label=<div className="header3">技術22課 </div> value={1} />
                <Tab label=<div className="header3">技術23課 </div> value={2} />
                <Tab label=<div className="header3">技術24課 </div> value={3} />
                <Tab label=<div className="header3">システムSol </div> value={4} />
              </Tabs>

            </div>
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              initialSlide={initialTeam_m}
              onSlideChange={(index) => slideChange(index.activeIndex)}
              onSwiper={(swiper) => {
                const swiperInstance = swiper;
                setSwiper(swiperInstance);
              }}
            >
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team_w}課 (仙台)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("21",i)} key={i}> <Card  kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team_w}課 (浜松)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係 (金沢)</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("22",i)} key={i}> <Card  kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team_w}課</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係 (浜松)</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("23",i)} key={i}> <Card  kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">{team_w}課 (浜松)</h3>
                <h3 className="header">1係</h3>
                <h3 className="header">2係 (金沢)</h3>
                <h3 className="header">3係</h3>
                <h3 className="header">4係</h3>
                <h3 className="header">5係 (仙台)</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("24",i)} key={i}> <Card  kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiCardHeaderContainer">
                <h3 className="header">システム Sol</h3>
                </div>
                <div className="kintaiCardContainer">
                {kintaiData.map((kintai,i) => {
                  return <button className="button"  onClick={() => onDClick("20",i)} key={i}><Card kintai={kintai} /> </button>;
                })}
                </div>
              </SwiperSlide>
            </Swiper>


            <div className="box">
            <div className="left-box">
            <p>情報<span>Information</span></p>
            </div>
            <div className="slide-sample">
                <ul>
                <li>{message}</li>
                </ul>    
            </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

function Home_system(team_w) {
  const id = team_w.match.params.id;
  team_w = id;
  initialTab_m = team_w - init_no_m;

  if (team_w === "20"){
    initialTab_m = 1;
  }

  initialTeam_m = initialTab_m;

  initialURL_m = backendURL + team_w;
  return <h2>Team {id}</h2>;
}
export default Sys_sol;