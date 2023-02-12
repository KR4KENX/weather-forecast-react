import React from "react";

export default function NextDays(props){
    console.log(props.tempScale)
    return (
        <div>
            {props.nextDays && 
                <section>
                    {props.nextDays.map((element) => {
                        return (
                                <div className="next-day--forecast">
                                    <h3>{element[2]}</h3>
                                    <p>{element[4]}</p>
                                    <img src={element[3]}/>
                                    <h4><span>{props.setTemperatureScale(element[0], props.tempScale)}<sup>o</sup>{props.tempScale ? 'C' : 'F'}</span> <span>{props.setTemperatureScale(element[1], props.tempScale)}<sup>o</sup>{props.tempScale ? 'C' : 'F'}</span></h4>
                                </div>
                        )
                    })}
                </section>
            }
        </div>
    )
}