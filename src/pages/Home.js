import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import voca from 'voca';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../config/Colors';
import API, {APIKEY} from '../config/Api';
import Geolocation from '@react-native-community/geolocation';
import WeatherImage from '../components/WeatherImages';
import ForecastToday from '../components/ForecastToday';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = ({navigation}) => {
  const [location, setLocation] = useState([]);
  const [weatherToday, setWeatherToday] = useState([]);
  const [failedLoadData, setFailedLoadData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
        getWeatherToday();
    }, 2000); 
    Geolocation.getCurrentPosition(info => {
      const position = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };

      setLocation(position);
    });
  }, []);

  const getWeatherToday = async () => {
    const lat = location.latitude;
    const lon = location.longitude;

    setFailedLoadData(false);

    await API.get(
      `/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric&lang=id`,
    )
      .then(res => {
        setWeatherToday(res.data);
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
          onPress={() => getWeatherToday()}
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
          ) : weatherToday.length === 0 ? (
            <Loading />
          ) : (
            <>
              <View style={styles.card}>
                <View style={styles.cardTitle}>
                  <View>
                    <Text style={styles.textHeading}>
                      {weatherToday && weatherToday.name}
                    </Text>
                    <Text style={styles.textSubHeading}>
                      {moment().format('dddd, DD MMMM YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardIcon}>
                  <Text style={styles.textTemperatur}>
                    {weatherToday.length !== 0 &&
                      Math.round(weatherToday.main.temp)}
                    °
                  </Text>
                  <WeatherImage
                    id={weatherToday.length !== 0 && weatherToday.weather[0].id}
                    condition={
                      weatherToday.length !== 0 && weatherToday.weather[0].main
                    }
                    width={width}
                    height={200}
                  />
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <Text style={styles.textHeading}>
                      (
                      {weatherToday.length !== 0 &&
                        voca.titleCase(weatherToday.weather[0].description)}
                      )
                    </Text>
                    <Text style={styles.textHeading2}>
                      Cuaca dapat berubah sewaktu-waktu
                    </Text>
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <View>
                    <Text style={styles.textSubHeading}>Angin</Text>
                    <Text style={styles.textHeading}>
                      {weatherToday.length !== 0 &&
                        Math.round(weatherToday.wind.speed)}
                      km/j
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.textSubHeading}>Suhu</Text>
                    <Text style={styles.textHeading}>
                      {weatherToday.length !== 0 &&
                        Math.round(weatherToday.main.temp)}
                      °C
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.textSubHeading}>Kelembaban</Text>
                    <Text style={styles.textHeading}>
                      {weatherToday.length !== 0 && weatherToday.main.humidity}%
                    </Text>
                  </View>
                </View>
              </View>
              <ForecastToday navigation={navigation} />
            </>
          )}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    height: height / 1.25,
  },
  cardTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 2,
    backgroundColor: Colors.dark['bg-primary'],
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
  textTemperatur: {
    fontSize: 200,
    fontWeight: '700',
    color: Colors.dark['text-secondary'],
    position: 'absolute',
    opacity: 0.9,
    top: -80,
    left: 0,
  },
});

export default Home;
