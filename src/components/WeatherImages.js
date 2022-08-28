import React from 'react';
import { Image, Dimensions } from 'react-native';

export default function WeatherImage({id, condition, width, height}){

    let weather;
    switch (condition) {
      case "Clouds":
        if(id === 800){
          weather = require(`../assets/icon/sun.png`)
        }else if(id === 801){
          weather = require(`../assets/icon/cloud-sun.png`)
        }else{
          weather = require(`../assets/icon/cloud.png`)
        }
        break;
      case "Rain":
        if(id >= 500 && id <= 504){
          weather = require(`../assets/icon/rain-sun.png`)
        }else if (id >= 520 && id <= 522){
          weather = require(`../assets/icon/rain.png`)
        }else{
          weather = require(`../assets/icon/wind-rain.png`)
        }
      break;
      case "Thunderstorm":
        if(id >= 200 && id <= 212){
          weather = require(`../assets/icon/rain-thunder.png`)
        }else{
          weather = require(`../assets/icon/cloud-thunder.png`)
        } 
        break;
      default:
        weather = require(`../assets/icon/cloud.png`)
        break;
    }

    return(
        <>
            <Image
              source={weather}
              style={{width: width, height: height, opacity: 0.9}}
              resizeMode="contain"
            />
        </>
    )
}