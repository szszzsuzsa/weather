import React, { useState } from 'react'
import PlacesAutocomplete, { } from "react-places-autocomplete";
import BeachVideo from './beach_video.mp4'
import ClearSky from './clear_sky.mp4'
import Rain from './rain.mp4'
import Clouds from './clouds.mp4'
import Snow from './snow.mp4'
import Loading from './tenorgood.gif'

const current_api = {
  key: "0aa989a6b4f2261c6f8f7232b1d1dc51",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [weekForcast, setWeekForcast] = useState({})
  const [description, setDescription] = useState('Clear')
  
  
 

  const search = locality => {
     fetch(`${current_api.base}weather?q=${locality}&units=metric&APPID=${current_api.key}`)
    .then(response => response.json())
    
    .then(result => {
      setWeather(result)
      weekly(result.coord)
      setQuery('')
      setDescription(result.weather[0].main)
      console.log(description)

    }); 
   
  }

  const weekly = coord => {
    fetch(`${current_api.base}onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=${current_api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeekForcast(result)
        console.log(result)
      })
  }

  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const dateBuilder = (d) => {
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  

  return (
    <PlacesAutocomplete
      value={query}
      onChange={setQuery}
      onSelect={search}
      
      key={Date.now} >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (

        <div className="app">

          <video id="bgvid"
              src={description == 'Rain' ? Rain 
               : description == 'Clouds' ? Clouds
               : description == 'Snow' ? Snow
               : description == 'Clear' ? ClearSky
               : BeachVideo
               } autoPlay loop muted title="Beach background" frameBorder="0">
          </video>

          <main>
            <div className="navbar"><h1>Table 7 - Weather App</h1></div>

            <div className="search-box">
              <input type="text" className="search-bar"
                {...getInputProps({ placeholder: "Type address" })} />
              <div className={!loading ? "suggestion-box-background suggestion-box" : "suggestion-box"} >
                {loading ? <div className='loading-box'><img src={Loading} alt="...Loading" style={{height: '50px'}} /></div> : null}

                {suggestions.map(suggestion => {
                  return (
                    <div key={suggestion.id} {...getSuggestionItemProps(suggestion)}>
                      {!loading && suggestion.types.includes("locality") ? suggestion.description : ""}
                    </div>
                  )
                })
                }
              </div>
            </div>

            {(typeof weather.main != "undefined") ? (
              <div className="location-container">
                <div className="location-box">
                  <div className="location">{weather.name}, {weather.sys.country}</div>
                  <div className="date">{dateBuilder(new Date())}</div>
                </div>
                <div className="current-temperature">
                  <div className="icon">
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather_icon" />
                  </div>
                  <div>
                    <div className="temp">
                      {Math.round(weather.main.temp)}°
                </div>
                    <div className="weather">
                      {weather.weather[0].main}
                    </div>
                  </div>
                </div>
                <div className='current-details'>
                  <div>
                    <p>{Math.round(weather.main.temp_max)}°</p>
                    <p>Highest</p>
                  </div>
                  <div>
                    <p>{(weather.wind.speed * 2.237).toFixed(2)} mph</p>
                    <p>Wind</p>
                  </div>
                  <div>
                    <p>{new Date(weather.sys.sunrise * 1000).getHours()} : {new Date(weather.sys.sunrise * 1000).getMinutes()}</p>
                    <p>Sunrise</p>
                  </div>
                  <div>
                    <p>{Math.round(weather.main.temp_min)}°</p>
                    <p>Lowest</p>
                  </div>
                  <div>
                    <p>{weather.main.humidity} %</p>
                    <p>Humidity</p>
                  </div>
                  <div>
                    <p>{new Date(weather.sys.sunset * 1000).getHours()} : {new Date(weather.sys.sunset * 1000).getMinutes()}</p>
                    <p>Sunset</p></div>
                </div>
              </div>
            ) : ('')}

            {(typeof weekForcast.daily != "undefined") ? (
              <>
                <h2>Forecast</h2>
                <div className="weekly-box">
                  {weekForcast.daily.map(day =>
                    <div className="weekly-element" key={day.dt}>

                      <p>{new Date(day.dt * 1000).getDate()} {months[new Date(day.dt * 1000).getMonth()]}</p>
                      <p>{days[new Date(day.dt * 1000).getDay()]}</p>
                      <p>{Math.round(day.temp.day)}°c</p>
                      <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="weather_icon" />
                    </div>)}</div>
              </>
            ) : ('')}

          </main>
        </div>
      )
      }
    </PlacesAutocomplete >)
}

export default App;

