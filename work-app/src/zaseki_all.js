import React, { useState, useEffect} from "react";
import { getContentData } from "./utils/kintai.js";
import './App.css';
import Seat from './components/Seat/Seat.js';
import Navbar from './components/Navbar/Navbar.js';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import { GetWeatherNewsS, GetWeatherNewsK, GetWeatherNewsH } from './components/Contents/weather.js'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import rd_j from "./psnrd_j.png"
import './workInfo.css';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
var SeatURL = "http://hoya.pmcrd.mei.co.jp:5001/seat"
var initialSeatURL = "http://hoya.pmcrd.mei.co.jp:5001/";
var initialIndex = 99

var content_message = "";

export const  Rd_zaseki_all = () =>{  
    const [loading, setLoading] = useState(true);
    const [seatData, setSeatData ] = useState([]);
    const [count, setCount] = useState(0);
    //swiper
    const [swiper, setSwiper] = useState(null);
    const [value, setValue] = useState(0);

    const settings = {
      spaceBetween: 50,
      slidesPerView: 1,
      initialSlide: 0,
      speed: 700,
    }; 

    initialIndex = count

    const slideChange = (index) => {
      setValue(index);
      if (index === 0){
        SeatURL = initialSeatURL + "seat";
      } else if (index === 1){
        SeatURL = initialSeatURL + "seat_s_2f";
      } else if (index === 2){
        SeatURL = initialSeatURL + "seat_k_7fp2";
      } else if (index === 3){
        SeatURL = initialSeatURL + "seat_k_7fs2";
      } else {
        SeatURL = initialSeatURL + "seat_j";
      }
      setCount(index)
      console.log(index,SeatURL);
    };
    const tabChange = (event, newValue) => {
      setValue(newValue);
      swiper.slideTo(newValue);
    };

    //座席情報を取得
    useEffect(() => {
      const fetchSeatData = async () => {
        if (initialIndex !== 99){
          //setValue(initialIndex);
          slideChange(initialIndex);
          initialIndex = 99;
        }

        let res = await getContentData(SeatURL);

        //天気情報を取得
        let res_s = await GetWeatherNewsS();
        let res_k = await GetWeatherNewsK();
        let res_h = await GetWeatherNewsH();
        content_message = "今日の天気  " + res_s + res_k + res_h;

        setLoading(false);
        setSeatData(res);
      };
      fetchSeatData();
    
      const interval = setInterval(() => {
        fetchSeatData();
      }, 350000);
    
      return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
  
  
  
    return(
      <>
      <Navbar title={'座席表'} />
      <div className="App">
      {loading ? (
        <>
        <h1>ロード中・・・</h1>
        </>
      ) : (
        <>
          <div className="header2">
            Teams同期時刻：{seatData[0].state} 
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
                <Tab label=<div className="header3">仙台3F </div> value={0} />
                <Tab label=<div className="header3">仙台2F </div> value={1} />
                <Tab label=<div className="header3">金沢7F県庁側 </div> value={2} />
                <Tab label=<div className="header3">金沢7F駅側 </div> value={3} />
                <Tab label=<div className="header3">仙台定禅寺オフィス </div> value={4} />
              </Tabs>

            </div>
            <Swiper {...settings}
              initialSlide = {value}
              onSlideChange={(index) => slideChange(index.activeIndex)}
              onSwiper={(swiper) => {
                const swiperInstance = swiper;
                setSwiper(swiperInstance);
              }}
            >
              <SwiperSlide>
                <div className="kintaiSeatContainer">
                  {seatData.map((seat,i) => {
                    return <Seat key={i} seat={seat} />;
                  })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div className="kintaiSeatContainer">
                  {seatData.map((seat,i) => {
                    return <Seat key={i} seat={seat} />;
                  })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiSeatK7FSContainer">
                  {seatData.map((seat,i) => {
                    return <Seat key={i} seat={seat} />;
                  })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="kintaiSeatK7FSContainer">
                  {seatData.map((seat,i) => {
                    return <Seat key={i} seat={seat} />;
                  })}
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div className="kintaiSeatSJContainer">
                  {seatData.map((seat,i) => {
                    return <Seat key={i} seat={seat} />;
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
              <li>{content_message}</li>
              </ul>    
          </div>
          </div>
  
        </>
      )}
      </div>
      </>
      
    );
  }

