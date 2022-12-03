import React, {useEffect, useState} from "react";
import {Card, List, Spin} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import ApiService from "common/services/ApiService";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getDayText = (dateDiff) => {
  let d = new Date();
  if (dateDiff > 0) d.setDate(d.getDate() + dateDiff);
  return monthNames[d.getMonth()] + " " + d.getDate();
}
const getDayName = (dateDiff) => {
  if (dateDiff === 0) return "Today";
  let d = new Date();
  if (dateDiff > 0) d.setDate(d.getDate() + dateDiff);
  return days[d.getDay()];
};

const DailyForecast = ({forecastData, dateDiff}) => {
  return (
    <div className={"d-flex flex-row justify-content-between mb-3"}>
      <div className={"d-flex flex-grow-1 flex-column"}>
        <div style={{opacity: '.5'}}>
          {getDayText(dateDiff)}
        </div>
        <div style={{fontSize: 18}}>
          {getDayName(dateDiff)}
        </div>
      </div>
      <div className={"d-flex flex-grow-1 flex-row justify-content-end align-items-center"}>
        <div>
          <img src={forecastData['day']['condition']['icon']} alt={'icon'} style={{width: 32}}/>
        </div>
        <div style={{marginLeft: 16, fontSize: 18}}>
          {forecastData.day['maxtemp_c']}°C
        </div>
        <div style={{marginLeft: 16, fontSize: 18, opacity: .75}}>
          {forecastData.day['mintemp_c']}°C
        </div>
      </div>
    </div>
  );
}

const WeatherWidget = props => {
  const [weatherReady, setWeatherReady] = useState(false);
  const [forecast, setForecast] = useState({});
  useEffect(() => {
    ApiService.getForecast().then(forecastData => {
      setForecast(forecastData.data);
      setWeatherReady(true);
    });
  }, []);
  return (
    <>
      <Spin spinning={!weatherReady}>
        <Card className={"weather-widget"} style={{
          background: '#4d34f2',
          color: '#FFF'
        }}>
          <div className="d-flex flex-row">
            <div className="d-flex flex-column flex-grow-1">
              <p style={{
                color: "white"
              }}>
                <HomeOutlined/> <span style={{fontSize: 16, marginLeft: 8}}>Hanoi</span>
              </p>
              <h1 style={{
                color: '#FFF',
                fontSize: 48,
                fontWeight: 800
              }}>
                {weatherReady ? `+${forecast['current']['feelslike_c']}°` : `--`}
              </h1>
            </div>
            {weatherReady && (
              <div className="d-flex flex-column flex-grow-1 align-items-end">

                <img src={forecast['current']['condition']['icon'].replace('64x64', '128x128')} alt={"icon"}
                     style={{
                       width: 72
                     }}/>
                <div>
                  {forecast['current']['condition']['text']}
                </div>
              </div>
            )}
          </div>
          <div className={"d-flex flex-column"} style={{
            height: 164,
            position: 'relative',
          }}>
            {weatherReady && (
              <div style={{
                height: 16,
                background: 'linear-gradient(180deg, rgba(77,52,242,1) 0%, rgba(0,212,255,0) 100%)',
                position: 'absolute',
                left: 0, right: 0, top: 0,
                zIndex: 1
              }}/>
            )}
            {weatherReady && (
              <div style={{
                height: 16,
                background: 'linear-gradient(0deg, rgba(77,52,242,1) 0%, rgba(0,212,255,0) 100%)',
                position: 'absolute',
                left: 0, right: 0, bottom: 0,
                zIndex: 1
              }}/>
            )}

            <div style={{
              height: '100%',
              overflowY: 'scroll',
              paddingTop: 16
            }}>
              {weatherReady && forecast['forecast']['forecastday'].map((dailyForecast, index) => (
                <DailyForecast forecastData={dailyForecast} key={index} dateDiff={index}/>
              ))}
            </div>

          </div>
        </Card>
      </Spin>
    </>
  )
};

export default WeatherWidget;
