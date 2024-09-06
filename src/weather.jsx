import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from './assets/back.jpg';

const Weather = () => {
  const [data, setData] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [location, setLocation] = useState('');
  const [view, setView] = useState('hourly');

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

      axios.get(geocodingUrl).then((response) => {
        setData(response.data);
        const { lat, lon } = response.data.coord;

        const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

        return axios.get(oneCallUrl);
      }).then((response) => {
        setHourlyData(response.data.hourly.slice(0, 6));
        setDailyData(response.data.daily.slice(0, 6));
      });

      setLocation('');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-[700px]  bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg">
        <div className="text-center">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            className="p-2 mb-4 rounded text-black"
          />
          {data.name && (
            <>
              <div className="flex items-center justify-between p-4 text-white mb-4 w-full">
                <div>
                  <h1 className="text-left text-4xl pb-2">{data.name}</h1>
                  <p className="text-left text-lg">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex flex-col items-start">
                    <img
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      alt={data.weather[0].description}
                      className="w-20 h-20"
                    />
                    <div className="text-left pt-4 text-2xl">{data.weather[0].description}</div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center p-4">
                  <div className="text-8xl font-light text-center">{Math.round(data.main.temp)}°</div>
                  <div className="text-center">
                    <div className="text-xl">
                      {Math.round(data.main.temp_max)}° / {Math.round(data.main.temp_min)}°
                    </div>
                  </div>
                </div>
              </div>


            </>
          )}
        </div>

        <div className="mt-8 text-white">
          <div className="flex justify-around border-b border-white pb-2">
            <span
              className={`cursor-pointer text-lg ${view === 'hourly' ? 'font-bold' : ''}`}
              onClick={() => setView('hourly')}
            >
              Hourly
            </span>
            <span
              className={`cursor-pointer text-lg ${view === 'daily' ? 'font-bold' : ''}`}
              onClick={() => setView('daily')}
            >
              Daily
            </span>
          </div>
          <div className="flex justify-around mt-4">
            {view === 'hourly' ? (
              hourlyData.map((hour, index) => (
                <div key={index} className="text-center">
                  <p className="text-lg">{new Date(hour.dt * 1000).getHours()}AM</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    className="w-12 mx-auto"
                  />
                  <p className="text-lg">{Math.round(hour.temp)}°</p>
                </div>
              ))
            ) : (
              dailyData.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-lg">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="w-12 mx-auto"
                  />
                  <p className="text-lg">{Math.round(day.temp.day)}°</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
