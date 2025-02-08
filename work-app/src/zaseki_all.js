import React, { useState, useEffect} from "react";
import { getContentData, changeSect } from "./utils/kintai.js";
import './App.css';
import Seat from './components/Seat/Seat.js';
import Navbar from './components/Navbar/Navbar.js';
import { GetWeatherNewsS, GetWeatherNewsK, GetWeatherNewsH, GetMessage, GetWeatherState  } from './components/Contents/weather.js'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './workInfo.css';
import backgroundKS7 from "./k_s_7f.png";
import backgroundKP7 from "./k_p_7f.png";
import backgroundJ from "./j_6f.png";
import backgroundH45 from "./h_4f.png";
import backgroundH5 from "./h_5f.png";
import backgroundH6 from "./hama_6f.png";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
var SeatURL = process.env.REACT_APP_BACKEND_URL + "seat";
var initialSeatURL = process.env.REACT_APP_BACKEND_URL;
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

    const seatParams = new URLSearchParams(window.location.search);
    var l_set = seatParams.get("init");
    var l_sect = seatParams.get("sect");
    console.log("初期スライド",l_set,l_sect)
    initialIndex = count
    if (l_set != null){
      initialIndex = Number(l_set)
      //window.history.replaceState('','','/layout');
      //window.location.href = '/team/' + l_sect
      setTimeout(() => {
        console.log("タイマータイムアウト!",l_sect);
        if (l_sect<20){
          window.location.href = '/musen/' + l_sect
        }
        else if (l_sect<30){
          window.location.href = '/system/' + l_sect
        }
        else {
          window.location.href = '/team/' + l_sect
        }
      }, 3000);
    }

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
      } else if (index === 4){
        SeatURL = initialSeatURL + "seat_j";
      } else if (index === 5){
        SeatURL = initialSeatURL + "seat_h_free4f";
      } else if (index === 6){
        SeatURL = initialSeatURL + "seat_h_free5f";
      } else {
        SeatURL = initialSeatURL + "seat_h_free6f";
      }
      setCount(index)
      console.log(index,SeatURL,"A");
    };
    const tabChange = (event, newValue) => {
      setValue(newValue);
      swiper.slideTo(newValue);
      window.history.replaceState('','','/layout');
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
  
    //勤怠カードクリック操作
    let clickCount = 0;
    const onDClick = (sect,n) => {
      clickCount++;
      if (clickCount < 2) {
        setTimeout(() => {
          if (1 === clickCount) {
            console.log("シングルクリック!",n,sect);
          }
          clickCount = 0;
        }, 500);
      }
    }
  
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
            <button className="chsect_button"  onClick={() => changeSect("/musen/11")}> 無線ソリューション部 </button><div className="sectSpace">　</div>            
            <button className="chsect_button"  onClick={() => changeSect("/system/21")}> システムソリューション部 </button><div className="sectSpace">　</div>
            <button className="chsect_button"  onClick={() => changeSect("/team/31")}> AIソリューション部 </button><div className="sectSpace">　</div>
            <button className="chsect_button"  onClick={() => changeSect("/layout")}> 座席表 </button>
 
          <div className="header3">
              <Tabs value={value} onChange={tabChange} centered>
                <Tab label=<div className="header3">仙台3F </div> value={0} />
                <Tab label=<div className="header3">仙台2F </div> value={1} />
                <Tab label=<div className="header3">金沢7F県庁側 </div> value={2} />
                <Tab label=<div className="header3">金沢7F駅側 </div> value={3} />
                <Tab label=<div className="header3">仙台定禅寺オフィス </div> value={4} />
                <Tab label=<div className="header3">浜松4F </div> value={5} />
                <Tab label=<div className="header3">浜松5F </div> value={6} />
                <Tab label=<div className="header3">浜松6F </div> value={7} />
              </Tabs>

          </div>
          <div className="map">
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
              <div style={{ 
                  backgroundImage: `url(${backgroundKP7})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'
                  }}>
                  <div className="kintaiSeatK7FSContainer">
                    {seatData.map((seat,i) => {
                      return <Seat key={i} seat={seat} />;
                    })}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundKS7})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'
                  }}>
                  <div className="kintaiSeatK7FSContainer">
                    {seatData.map((seat,i) => {
                      return <Seat key={i} seat={seat} />;
                    })}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundJ})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'
                  }}>
                  <div className="kintaiSeatContainer2">
                    {seatData.map((seat,i) => {
                      return <Seat key={i} seat={seat} />;
                    })}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundH45})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'  
                  }}>
                  <div className="kintaiSeatContainerhama45f">
                    {seatData.map((seat,i) => {
                      return <button className="button"  onClick={() => onDClick("34",i)} key={i}><Seat seat={seat} /> </button>;
                    })}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundH5})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'  
                  }}>
                  <div className="kintaiSeatContainerhama45f">
                    {seatData.map((seat,i) => {
                      return <button className="button"  onClick={() => onDClick("34",i)} key={i}><Seat seat={seat} /> </button>;
                    })}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundH6})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1220px 905px'  
                  }}>
                  <div className="kintaiSeatContainerhama6f">
                    {seatData.map((seat,i) => {
                      return <button className="button"  onClick={() => onDClick("34",i)} key={i}><Seat seat={seat} /> </button>;
                    })}
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            </div>
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

