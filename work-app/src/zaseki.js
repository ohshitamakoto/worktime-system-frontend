import React, { useState, useEffect} from "react";
import { getContentData } from "./utils/kintai.js";
import './App.css';
import Seat from './components/Seat/Seat.js';
import Navbar from './components/Navbar/Navbar.js';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import { GetWeatherNewsS, GetWeatherNewsK, GetWeatherNewsH } from './components/Contents/weather.js'

var content_message = "";

function Rd_zaseki() {  
    const [loading, setLoading] = useState(true);
    const [seatData, setSeatData ] = useState([]);
    //座席情報を取得
    useEffect(() => {
      const fetchSeatData = async () => {
      var initialSeatURL = "http://hoya.pmcrd.mei.co.jp:5001/seat";
      let res = await getContentData(initialSeatURL);

      //天気情報を取得
      let res_s = await GetWeatherNewsS();
      let res_k = await GetWeatherNewsK();
      let res_h = await GetWeatherNewsH();
      content_message = "今日の天気  " + res_s + res_k + res_h;

      setLoading(false);
      setSeatData(res);
    };
    fetchSeatData();

    const refreshInterval = setInterval(fetchSeatData, 5000);
    return () => clearInterval(refreshInterval);
    }, []);
  
  
  
    return(
      <>
      <Navbar title={'仙台 3F 座席表'} />
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
          <Button variant="outlined" size="x-large" component={Link} to="/team/31">AIソリューション部</Button>
          <div className="sectSpace">　</div>
          <Button variant="outlined" size="x-large" component={Link} to="/layout">座席表</Button>
  
          <div className="kintaiSeatContainer">
            {seatData.map((seat,i) => {
              return <Seat key={i} seat={seat} />;
            })}
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
  export default Rd_zaseki;