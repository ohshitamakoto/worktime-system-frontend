import React, { useState, useEffect} from "react";
import { getContentData } from "./utils/kintai.js";
import './zaseki.css';
import Seat from './components/Seat/Seat.js';
import Navbar from './components/Navbar/Navbar.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './workInfo.css';
import backgroundH4 from "./h_4f.png";
import backgroundH5 from "./h_5f.png";
import backgroundH6 from "./hama_6f.png";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
var SeatURL = process.env.REACT_APP_BACKEND_URL + "seat";
var initialSeatURL = process.env.REACT_APP_BACKEND_URL;
var initialIndex = 99

export const  Rd_zaseki_free = () =>{  
    const [loading, setLoading] = useState(true);
    const [seatData, setSeatData ] = useState([]);
    const [count, setCount] = useState(0);
    const [errMsg, setErrMsg ] = useState([]);
    const [seatDisp, setSeatDisp ] = useState([]);
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
        SeatURL = initialSeatURL + "seat_h_free4f";
      }else if (index === 1){
        SeatURL = initialSeatURL + "seat_h_free5f";
      } else {
        SeatURL = initialSeatURL + "seat_h_free6f";
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

        const seatParams = new URLSearchParams(window.location.search);
        const l_set = seatParams.get("set");
        if(l_set === "rel"){
          setSeatDisp("解放する座席を選択してください")
        } else {
          setSeatDisp("利用する座席を選択してください")
        }

        setLoading(false);
        setSeatData(res);
      };
      fetchSeatData();

      const refreshInterval = setInterval(fetchSeatData, 5000);
      return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
  
    //勤怠カードクリック操作
    let clickCount = 0;
    const onDClick = (n) => {
      clickCount++;
      if (clickCount < 2) {
        setTimeout(() => {
          if (1 === clickCount) {
            postSeatDate(n)
          }
          clickCount = 0;
        }, 500);
      }
    }

    const postSeatDate = async (n) => {
        const seatParams = new URLSearchParams(window.location.search);
        var l_name = seatParams.get("name");
        var l_sect = seatParams.get("sect");
        const l_set = seatParams.get("set");
        var swipno = count + 4
        console.log("シングルクリック!",l_name,l_sect,n);
        SeatURL = initialSeatURL + "seat_h_free" + swipno + "f";


        if (l_set === "rel") {
          l_name = "Free"
          //l_sect = 99
        }
        let result = "";
        try {
          await fetch(SeatURL,{
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({name: l_name,sect: l_sect,no: n})
          })
          .then(response =>  response.text())
          .then(data => {
                            result = data;});
        } catch (err) {
          alert(err)
        }
        console.log(result);
        if (result === "OK"){
          swipno = swipno + 1
          window.location.href = '/layout?init=' + swipno + '&sect=' + l_sect
          //'/layout' + '?init=' + swipno + '&sect=' + l_sect
        } else {
          setErrMsg(result)
          ng_dialog.showModal();
        }
    }
    const onCancelClick = () => {
      const seatParams = new URLSearchParams(window.location.search);
      var l_sect = seatParams.get("sect");
      if (l_sect<20){
        window.location.href = '/musen/' + l_sect
      }
      else if (l_sect<30){
        window.location.href = '/system/' + l_sect
      }
      else {
        window.location.href = '/team/' + l_sect
      }
    }
    const ng_dialog = document.querySelector("#ng_dialog");
    const onNgClose = () => {
      ng_dialog.close();
    }
    return(
      <>
      <Navbar title={'フリーアドレス席指定'} />
      <div className="Zaseki">
      {loading ? (
        <>
        <h1>ロード中・・・</h1>
        </>
      ) : (
        <>
          <div className="headerfree">
          <br></br>
              <Tabs value={value} onChange={tabChange} centered>
                <Tab label=<div className="headerfree">浜松4F </div> value={0} />
                <Tab label=<div className="headerfree">浜松5F </div> value={1} />
                <Tab label=<div className="headerfree">浜松6F </div> value={2} />
              </Tabs>
              <br></br>
              {seatDisp}
              <br></br>
              
            </div>
            
            <div className="freemap">
            <Swiper {...settings}
              initialSlide = {value}
              onSlideChange={(index) => slideChange(index.activeIndex)}
              onSwiper={(swiper) => {
                const swiperInstance = swiper;
                setSwiper(swiperInstance);
              }}
            >
              <SwiperSlide>
              <div style={{ 
                  backgroundImage: `url(${backgroundH4})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1920px 905px'  
                  }}>
                  <div className="kintaiSeatContainerhama45f">
                    {seatData.map((seat,i) => {
                       return <button className="button"  onClick={() => onDClick(i)} key={i}><Seat seat={seat} /> </button>;
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
                       return <button className="button"  onClick={() => onDClick(i)} key={i}><Seat seat={seat} /> </button>;
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
                      return <button className="button"  onClick={() => onDClick(i)} key={i}><Seat seat={seat} /> </button>;
                    })}
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            </div>
            <button className="his_button_close"  onClick={() => onCancelClick()}> キャンセル </button>
        </>
      )}
      </div>
      <dialog id="ng_dialog">
        <div className="overlay">
          <div className="history_dialog">
            <p>{errMsg}</p>
            <button className="his_button_close"  onClick={() => onNgClose()}> 閉じる </button>
          </div>
          
        </div>
      </dialog>
      </>
    );
  }

