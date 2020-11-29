import React, {useState, createContext} from 'react';

export const WeatherContext = createContext(null);


export const WeatherProvider = props => {
  const [weather, setWeather] = useState({})

  return (
    <WeatherContext.Provider value={{
      weather,
      setWeather,
    }}>
      {props.children}
    </WeatherContext.Provider>
  );
}
