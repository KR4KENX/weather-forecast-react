import React from "react";

export default function Forecast(props){
    
    function temperatureInfo(){
      //conditional rendering
      if(props.weather.temp!=""){
        return(
        <main>
            <div>
                <h3 id='location'>{props.weather.location}</h3>
                <div className="temp-box">
                    <img src={props.weather.weatherImg}/>
                <h2 id='temperature'>
                    {props.setTemperatureScale(props.weather.temp, props.tempScale)}<sup>o</sup>{props.tempScale ? 'C' : 'F'}
                </h2>
                </div>
                <div className="info">
                    <p id="condition-text">{props.weather.condition}</p>
                    <p id="humidity">{Math.floor(props.weather.humidity)} <span className="material-symbols-outlined">humidity_high</span> humidity</p>
                </div>
            </div>
        </main>
        )
      }
    }

    return (
        <div>
        {temperatureInfo()}
        </div>
    )
}