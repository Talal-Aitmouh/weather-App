import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Thermometer, Wind, Droplets, Sun } from 'lucide-react';

const Weather = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');

  const fetchLocalWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`lat=${latitude}&lon=${longitude}`);
      });
    }
  };

  useEffect(() => {
    fetchLocalWeather();
  }, []);

  const fetchWeather = (query) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${import.meta.env.VITE_KEY}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
      });
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeather(`q=${location}`);
      setLocation('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
    
      >
        <video
    autoPlay
    loop
    muted
    className="absolute inset-0 w-full h-screen object-cover"
  >
    <source src="/weat.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="absolute w-full h-screen inset-0 bg-black bg-opacity-50 backdrop-blur-sm">

  </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={searchLocation}
              placeholder="Search location..."
              className="w-full p-4 pr-12 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {data && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-white"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">{data.name}</h1>
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm mt-1">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt={data.weather[0].description}
                    className="w-20 h-20"
                  />
                  <p className="text-xl capitalize ml-2">{data.weather[0].description}</p>
                </div>
                <div className="text-6xl font-light">
                  {Math.round(data.main.temp)}°C
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <WeatherDetail icon={<Thermometer />} label="Feels like" value={`${Math.round(data.main.feels_like)}°C`} />
                <WeatherDetail icon={<Wind />} label="Wind speed" value={`${data.wind.speed} m/s`} />
                <WeatherDetail icon={<Droplets />} label="Humidity" value={`${data.main.humidity}%`} />
                <WeatherDetail icon={<Sun />} label="UV Index" value="N/A" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const WeatherDetail = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center bg-white bg-opacity-20 rounded-lg p-3"
  >
    {icon}
    <div className="ml-3">
      <p className="text-sm text-gray-200">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default Weather;