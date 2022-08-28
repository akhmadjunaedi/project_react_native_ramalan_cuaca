import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment-timezone';
import voca from 'voca';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WeatherImage from '../components/WeatherImages';
import API, {APIKEY} from '../config/Api';
import {Colors} from '../config/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';

export default function Forecast({navigation}) {
  const today = moment().format('YYYY-MM-DD');
  const [failedLoadData, setFailedLoadData] = useState(false);
  const [forecastIndex, setForecastIndex] = useState(0);
  const [forecastActiveDay, setForecastActiveDay] = useState(today);
  const [forecastWeather, setForecastWeather] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getForecastWeather();
    }, 2000);
    Geolocation.getCurrentPosition(info => {
      const position = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };

      setLocation(position);
    });
  }, []);

  const getForecastWeather = async () => {
    const lat = location.latitude;
    const lon = location.longitude;

    const hours = moment().format('HH');
    const todayForecastLimit = Math.floor((24 - hours) / 3);
    const nextDayForecastLimit = todayForecastLimit + 24;

    setFailedLoadData(false);

    await API.get(
      `/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric&lang=id&cnt=${nextDayForecastLimit}`,
    )
      .then(res => {
        setForecastWeather(res.data.list);
        setFailedLoadData(false);
      })
      .catch(err => {
        setFailedLoadData(true);
      });
  };

  function Loading() {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <ActivityIndicator
          animation={true}
          size="large"
          color={Colors.dark['bg-blue']}
        />
      </View>
    );
  }

  function FailedLoad() {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          color={Colors.dark['text-danger']}
          size={60}
          style={{marginBottom: 10}}
        />
        <Text style={{fontSize: 20, color: Colors.dark['text-secondary']}}>
          Gagal Ambil Data
        </Text>
        <Text style={{color: Colors.dark['text-secondary']}}>
          Terjadi kesalahan saat mengambil data cuaca
        </Text>
        <TouchableOpacity
          onPress={() => getForecastWeather()}
          style={{
            backgroundColor: Colors.dark['bg-primary'],
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text style={{color: Colors.dark['text-secondary']}}>Ulangi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar animated={true} backgroundColor={Colors.dark['bg-primary']} />
      <LinearGradient
        colors={[Colors.dark['bg-primary'], Colors.dark['bg-secondary']]}
        start={{x: 0.1, y: 0.2}}
        end={{x: 0.5, y: 1.0}}
        locations={[0, 0.5]}>
        <View style={styles.container}>
          {failedLoadData ? (
            <FailedLoad />
          ) : forecastWeather.length === 0 ? (
            <Loading />
          ) : (
            <>
              <View style={styles.body}>
                <View>
                  <Text style={styles.heading}>Ramalan Cuaca</Text>
                  <Text style={styles.subheading}>
                    {moment
                      .utc(forecastWeather[forecastIndex].dt_txt)
                      .tz('Asia/Jakarta')
                      .format('dddd, DD-MM-YYYY')}
                  </Text>
                  <Text style={styles.largeheading}>
                    {Math.round(forecastWeather[forecastIndex].main.temp)}°C
                  </Text>
                  <Text style={styles.subheading}>
                    (
                    {voca.titleCase(
                      forecastWeather[forecastIndex].weather[0].description,
                    )}
                    )
                  </Text>
                </View>
                <WeatherImage
                  id={forecastWeather[forecastIndex].weather[0].id}
                  condition={forecastWeather[forecastIndex].weather[0].main}
                  width={120}
                  height={120}
                />
              </View>

              <View style={styles.datelist}>
                {[0, 1, 2, 3].map(v => {
                  const day =
                    v >= 1
                      ? moment().add(v, 'days').format('dddd')
                      : moment().format('dddd');
                  const date =
                    v >= 1
                      ? moment().add(v, 'days').format('DD')
                      : moment().format('DD');
                  const fullDate =
                    v >= 1
                      ? moment().add(v, 'days').format('YYYY-MM-DD')
                      : moment().format('YYYY-MM-DD');

                  return (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setForecastActiveDay(fullDate)}
                      style={[
                        styles.dateblock,
                        {
                          backgroundColor:
                            forecastActiveDay === fullDate
                              ? Colors.dark['bg-primary']
                              : Colors.dark['bg-blue'],
                        },
                      ]}>
                      <Text style={{color: '#FFF'}}>{day}</Text>
                      <Text style={styles.largeheading3}>{date}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{marginBottom: 10, padding: 10}}>
                <Text style={styles.subheading}>Ramalan Cuaca</Text>
                <Text style={{fontSize: 18, color: '#FFF'}}>
                  {moment(forecastActiveDay).format('dddd, DD-MM-YYYY')}
                </Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {forecastWeather.map((value, index) => {
                  let forecastDay = moment
                    .utc(value.dt_txt)
                    .tz('Asia/Jakarta')
                    .format('YYYY-MM-DD');
                  let activeDay =
                    moment(forecastActiveDay).format('YYYY-MM-DD');
                  if (forecastDay == activeDay) {
                    return (
                      <TouchableOpacity
                        onPress={() => setForecastIndex(index)}
                        key={index}
                        style={styles.weatherlist}>
                        <WeatherImage
                          id={value.weather[0].id}
                          condition={value.weather[0].main}
                          width={60}
                          height={60}
                        />
                        <Text
                          style={styles.largeheading2}>
                          {Math.round(value.main.temp)}°C
                        </Text>
                        <View>
                          <Text style={{fontSize: 20, color: '#FFF'}}>
                            {moment
                              .utc(value.dt_txt)
                              .tz('Asia/Jakarta')
                              .format('HH:mm')}
                          </Text>
                          <Text style={{fontSize: 15, color: '#FFF'}}>WIB</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            </>
          )}
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    height: '100%',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark['bg-secondary'],
    padding: 20,
    borderRadius: 20,
    elevation: 2,
    alignItems: 'center',
  },
  datelist: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  dateblock: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    width: '23.33%',
  },
  weatherlist: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark['bg-primary'],
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  largeheading: {
    fontSize: 60,
    fontWeight: '600',
    color: '#FFF',
    paddingTop: 10,
  },
  largeheading2: {
    fontSize: 50,
    fontWeight: '600',
    color: '#FFF',
  },
  largeheading3: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFF',
  },
  heading: {fontSize: 24, color: '#FFF', fontWeight: 'bold'},
  subheading: {fontSize: 14, color: '#FFF'},
});
