import React, { useState, useEffect } from 'react';
import Forecast from './components/Forecast';
import NextDays from './components/NextDays';

import rainy from '../src/assets/rainy.png'
import sunny from '../src/assets/sunny.png'
import cloudy from '../src/assets/cloudy.png'

function App() {  
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState({
      temp: "",
      location: "",
      condition: "",
      humidity: ""
    });
  const [nextDays, setNextDays] = useState()
  const [isCelcius, setScale] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState('');

  useEffect(() => {
    if(!defaultLocation)
      return;

    localStorage.setItem('defaultLocationItem', defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    let storageItem = localStorage.getItem('defaultLocationItem');
    if(storageItem != undefined){
      setDefaultLocation(storageItem)
    };

    let splitedPlace = storageItem.split(',');

    if(!splitedPlace)
      return;

    loadWeatherFromApi(splitedPlace[0]);
  }, [])

  //setting weekday
    function setWeekday(day){
      if(day == 0 || day == 7) return "Sunday";
      if(day == 1 || day == 8) return "Monday";
      if(day == 2 || day == 9) return "Tuesday";
      if(day == 3 || day == 10) return "Wednesday";
      if(day == 4) return "Thursday";
      if(day == 5) return "Friday";
      if(day == 6) return "Saturday";
    }
  //setting scale
  function setTemperatureScale(temp,isCelciusScale){
    if(isCelciusScale === true){
      return temp;
    }
    if(isCelciusScale === false){
      return temp*2+32;
    }
  }

  //setting clouds image
  const images = {
    cloudy: cloudy,
    rainy: rainy,
    sunny: sunny,
  }

  function setWeatherImage(currentCondition){
      if(currentCondition === "Partially cloudy"){
          return images.cloudy;
      }
      if(currentCondition === "Clear"){
          return images.sunny;
      }
      if(currentCondition === "Overcast"){
          return images.rainy;
      }
      else{
          return images.cloudy;
      }
  }
  //setting date in header
  let date = new Date();
  let weekday = setWeekday(date.getDay());

  let current_date = weekday + " " + date.getDate() + "." + parseInt(date.getMonth()+1) + "." + date.getFullYear();

  //scale State (default is fahrenheit)
    function toggleTempScale(){
      setScale(prevValue => !prevValue)
    }
    
    //connect with API
    function loadWeatherFromApi(place){
      fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + place +'?unitGroup=metric&include=current&key=8EYW3S44EPSLY4M2LSUEX8Y2B&contentType=json')
      .then((response) => response.json())
      .then((data) => {;
        setNextDays(() => {
          //next 3 days
          const howManyDays = 3;
          const nextDaysArray = [];
          for(let i=0; i<howManyDays; i++){
            nextDaysArray.push([
              data.days[i+1].temp,
              data.days[1+1].tempmax,
              setWeekday(date.getDay()+i+1),
              setWeatherImage(data.days[i+1].conditions),
              date.getDate()+"."+parseInt(date.getMonth()+1)
            ]);
          }
          return nextDaysArray;
        })

        setWeather(() => {
          //today
        return{
          temp: data.days[0].temp,isCelcius,
          location: data.resolvedAddress,
          condition: data.currentConditions.conditions,
          humidity: data.currentConditions.humidity,
          weatherImg: setWeatherImage(data.days[0].conditions)
        }
      })});
    }

  return (
    <div className="App">
      <header>
        <div id="left--panel">
            <input type="text" placeholder="Insert location..." onInput={(event) => {setLocation(event.target.value)}}></input>
            <span className="material-symbols-outlined" onClick={() => {loadWeatherFromApi(location)}}>
            location_on
            </span>
        </div>
        <div id="right--panel">
            <h3>{current_date}</h3>
            <div className="toggler" id={isCelcius==true ? "celcius" : ""}>
                <p className="toggler--light">Fahrenheit</p>
                <div 
                    className="toggler--slider"
                    onClick={() => toggleTempScale()}
                >
                <div className="toggler--slider--circle"></div>
                </div>
                <p className="toggler--dark">Celcius</p>
            </div>
        </div>
      </header>
      <Forecast 
          weather={weather}
          tempScale={isCelcius}
          setTemperatureScale={setTemperatureScale}
          setDefLocation={setDefaultLocation}
      />
      <NextDays
          nextDays={nextDays}
          tempScale={isCelcius}
          setTemperatureScale={setTemperatureScale}       
       />
    </div>
  );
}

export default App;
