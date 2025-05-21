import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const fetchWeather = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message)
                console.warn(data.message);
                return setWeatherData(null);
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                country: data.sys.country,
                icon: icon
            });
        } catch (error) {
            console.error("Weather fetch error:", error);
            setWeatherData(null);
        }
    };

    const fetchWeatherByCoords = (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        fetchWeather(url);
    };

    const search = (city) => {
        if (!city) return alert('Enter a city name');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        fetchWeather(url);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    console.warn("Geolocation failed, defaulting to Delhi:", error.message);
                    search("Delhi");
                }
            );
        } else {
            console.warn("Geolocation not supported, defaulting to Delhi.");
            search("Delhi");
        }
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value);
        }
    };

    return (
        <div className='weather'>
            <div className='search-bar'>
                <input
                    ref={inputRef}
                    onKeyUp={handleKeyPress}
                    type="text"
                    placeholder='Search'
                    autoComplete='off'
                />
                <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
            </div>

            {weatherData && (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}, {weatherData.country}</p>
                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt="Wind" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
