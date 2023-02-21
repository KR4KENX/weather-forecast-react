import React from 'react';
import Forecast from './components/Forecast';
import NextDays from './components/NextDays';
import rainy from '../src/assets/rainy.png'
import sunny from '../src/assets/sunny.png'
import cloudy from '../src/assets/cloudy.png'

function App() {  
  const [location, setLocation] = React.useState("");
  const [weather, setWeather] = React.useState({
      temp: "",
      location: "",
      condition: "",
      humidity: ""
    });
  const [nextDays, setNextDays] = React.useState()
  const [isCelcius, setScale] = React.useState(false);
  const [defaultLocation, setDefaultLocation] = React.useState('');

  React.useEffect(() => {
    if(!defaultLocation)
      return;

    localStorage.setItem('defaultLocationItem', defaultLocation);
  }, [defaultLocation]);

  React.useEffect(() => {
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
      switch (day){
        case 0:
          return "Sunday"
        break;
        case 1:
          return "Monday"
        break;
        case 2:
          return "Tuesday"
        break;
        case 3:
          return "Wednesday"
        break;
        case 4:
          return "Thursday"
        break;
        case 5:
          return "Friday"
        break;
        case 6:
          return "Saturday"
        break;
        case 7:
          return "Sunday"
        break;
        case 8:
          return "Monday"
        break;
        case 9:
          return "Tuesday"
        break;
        case 10:
          return "Wednesday"
        break;
      }
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

  const images = {
    cloudy: cloudy,
    rainy: rainy,
    sunny: sunny,
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
          return[
            [
              data.days[1].temp,
              data.days[1].tempmax,
              setWeekday(date.getDay()+1),
              setWeatherImage(data.days[1].conditions),
              date.getDate()+"."+parseInt(date.getMonth()+1)
            ],
            [
              data.days[2].temp,
              data.days[2].tempmax,
              setWeekday(date.getDay()+2),
              setWeatherImage(data.days[2].conditions),
              parseInt(date.getDate()+1)+"."+parseInt(date.getMonth()+1)
            ],
            [
              data.days[3].temp,
              data.days[3].tempmax,
              setWeekday(date.getDay()+3),
              setWeatherImage(data.days[3].conditions),
              parseInt(date.getDate()+2)+"."+parseInt(date.getMonth()+1)
            ]
          ]
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
