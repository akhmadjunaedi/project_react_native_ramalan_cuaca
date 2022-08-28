import Geolocation from '@react-native-community/geolocation';
import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API, {APIKEY} from '../config/Api';
import {Colors} from '../config/Colors';
import WeatherImage from './WeatherImages';

export default function ForecastToday({navigation}) {
  const [location, setLocation] = useState([]);
  const [forecastWeather, setForecastWeather] = useState([]);

  useEffect(() => {
    forecastWeather.length === 0 && getForecastWeather();
    Geolocation.getCurrentPosition(info => {
        const position = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };
  
        setLocation(position);
      });
  }, [location]);

  const getForecastWeather = async () => {
    const lat = location.latitude;
    const lon = location.longitude;

    const hours = moment().format('HH');
    const todayForecastLimit = Math.floor((24 - hours) / 3);

    await API.get(
      `/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric&lang=id&cnt=${todayForecastLimit}`,
    )
      .then(res => {
        setForecastWeather(res.data.list);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.cardBottom}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.textHeading2}>Cuaca Hari ini</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Forecast")}>
            <Text style={styles.textSubHeading}>Lihat semua</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.cardBottomMore}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {forecastWeather.length !== 0 &&
          forecastWeather.map((value, index) => (
            <TouchableOpacity style={styles.weatherList} key={`map-${index}`}>
              <WeatherImage
                id={value.length !== 0 && value.weather[0].id}
                condition={value.length !== 0 && value.weather[0].main}
                width={50}
                height={50}
              />
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 24,
                    color: Colors.dark['text-secondary'],
                  }}>
                  {Math.round(value.main.temp)}°C
                </Text>
                <Text style={{color: Colors.dark['text-secondary']}}>
                  {moment.utc(value.dt_txt).tz('Asia/Jakarta').format('HH:mm')}{' '}
                  wib
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
  },
  cardBottomMore: {
    display: 'flex',
    flexDirection: 'row',
  },
  weatherList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 10,
    backgroundColor: Colors.dark['bg-blue'],
  },
  textHeading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark['text-secondary'],
  },
  textHeading2: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.dark['text-secondary'],
  },
  textSubHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark['text-gray'],
  },
});
