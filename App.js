import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';

const { width:SCREEN_WIDTH } = Dimensions.get("window"); //현재 디바이스의 사이즈를 가져옴

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rain",
  Drizzle: "day-rain",
  Thunderstorm: "lighting",
}

export default function App() {

  const [city, setCity] = useState("Loading...");

  const [days, setDays] = useState([]);

  const [ok, setOk] = useState(true);

  const getWeather = async() => {        // 기기에서 위치제공 허락받기
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false}); //위치 가져오기
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily)
  };
  
  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled   //슬라이드처럼 한페이지씩 스크롤링
        horizontal      //가로방향으로 스크롤 default는 세로
        showsHorizontalScrollIndicator={false}        //스크롤바 숨김
        //indicatorStyle='white'                      //스크롤바 색상변경(ios에서만 가능)
        contentContainerStyle={styles.weather}        //ScrollView에서 style속성을 쓸 때는 contentContainerStyle을 써야함
        >     
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
          </View>
        ) : (
          days.map((day, index) => 
          <View key={index} style={styles.day}>
            <View 
              style={{
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-between",
                width: "100%",
                }}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color:"white",
    fontSize: 48,
    fontWeight: "500",
  },
  weather: {
    //스크롤뷰에선 flex를 지정x 풀스크린사이즈보다 커야하므로
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "left",
    paddingLeft: 20,
    paddingRight: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 128,
    color:"white",
  },
  description: {
    marginTop: -30,
    fontSize: 50,
    color:"white",
  },
  tinyText: {
    fontSize: 20,
    color:"white",
  }
})

