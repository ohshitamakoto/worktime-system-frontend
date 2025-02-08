//import React from 'react';
import './workInfo.css';
import React, { useState, useEffect} from "react";
import { Chart, registerables } from "chart.js"
import { Doughnut } from 'react-chartjs-2';
import { getKintaiData } from "./utils/kintai.js";
import Navbar from './components/Navbar/Navbar.js';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import rd_s from "./psnrd_flo.png"
var initialURL = "http://hoya.pmcrd.mei.co.jp:5001/w_info"
Chart.register(...registerables)
Chart.register(ChartDataLabels)

const ChartComponent = () => {
    const [loading, setLoading] = useState(true);
    const [kintaiData, setKintaiData ] = useState([]);
    const [update, setUpdate] = useState(false);
    const [chartData, setChartData] = useState();
    const [optionData, setOptionData] = useState();

    useEffect(() => {
      const fetchKWorkInfo = async () => {
        let res = await getKintaiData(initialURL);
        setKintaiData(res);

        const newData = kintaiData.map(item => ({
          labels: ['出社', '在宅', '出張', '年休'],
          datasets: [{
            data: [item.office + item.work, item.home, item.trip, item.rest],
            hoverBackgroundColor: ["#FFCE56", "#FFCE56", "#FFCE56", "#FFCE56"],
            backgroundColor: [
              'rgba(0, 90, 250, 0.6)',
              'rgba(3, 163, 67, 0.6)',
              'rgba(8, 162, 228, 0.6)',
              'rgba(255, 0, 0, 0.6)'
            ],
            borderWidth: 1,
          }],
        }));
        setChartData(newData);

        const newOpData = kintaiData.map(item => ({
          plugins: {
            datalabels: {
              display: true,
              color: '#000000',
              formatter: (value, context) => {
                const staticLabels = [item.office + item.work, item.home, item.trip, item.rest];
                return staticLabels[context.dataIndex] + '人';
              },
              anchor: 'center',
              align: 'center',
              font: {
                size: 20,
              },
            },
          },
        }));
        setOptionData(newOpData);

        setLoading(false);
        setUpdate(true);
        console.log(newData);
      };
      fetchKWorkInfo();
  
      const interval = setInterval(() => {
          fetchKWorkInfo();
      }, 30000);
  
      return () => clearInterval(interval);
    }, [update,]);

  return(
    <>
    <Navbar title={'拠点別　勤怠状況'} sect={1}/>
    <div className="WorkApp">
      {loading ? (
        <>
        <h3>ロード中・・・</h3>
        </>
      ) : (
        <>
          <div>
          <Button variant="outlined" size="x-large" component={Link} to="/musen/11">無線ソリューション部</Button>
          <div className="sectSpace">　</div>
          <Button variant="outlined" size="x-large" component={Link} to="/system/21">システムソリューション部</Button>
          <div className="sectSpace">　</div>
          <Button variant="outlined" size="x-large" component={Link} to="/team/31">AIソリューション部</Button>
          <div className="sectSpace">　</div>
          <Button variant="outlined" size="x-large" component={Link} to="/layout">座席表</Button>
          </div>
          
          <div className="chart-container">

            {chartData.map((data, index) => (
              <div key={index} className="chart">
              {kintaiData[index].place}
              <Doughnut data={data}  options={optionData[index]} />
              <div className="png_map">
              <ptitle>出社勤務中</ptitle>
              <pg>{kintaiData[index].work}</pg>
              </div>
              </div>
            ))}
          </div>
          <h3>フロア別　出社勤務状況</h3>
          <div className="png_map">
            <img src={rd_s} />
            <ps2>{kintaiData[0].work_1}人</ps2>
            <ps3>{kintaiData[0].work_2}人</ps3>
            <pj6>{kintaiData[1].work_1}人</pj6>
            <pk7>{kintaiData[2].work_1}人</pk7>
            <pha>{kintaiData[3].work_1}人</pha>
          </div>
        </>
      )}
    </div>
    </>
    
  );
};

export default ChartComponent;