import React, {useEffect, useState} from 'react';
import './DigitalDateTime.css';

const weekday = ['日', '月', '火', '水', '木', '金', '土'];

const DigitalDateTime = () => {
  const [date, setDate] = useState([]);
  const [time, setTime] = useState([]);

  useEffect(() => {
    setInterval(() => {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let dayofweek = d.getDay();
      let days = year + '年' + month + '月' + day + '日';
      setDate(days+ '(' + weekday[dayofweek] + ')');
      let hour = d.getHours().toString().padStart(2, '0');
      let minute = d.getMinutes().toString().padStart(2, '0');
      setTime(hour + ':' + minute);
    }, 1000);
  }, []);

  return (
    <div className="Digit">
      <p className="digit">{date} <span>{time}</span></p>
    </div>
  );
}

export default DigitalDateTime