import React, {useState, createContext} from 'react';

export const ForecastsContext = createContext(null);


export const ForecastsProvider = props => {
  const [forecasts, setForecasts] = useState({})

  return (
    <ForecastsContext.Provider value={{
      forecasts,
      setForecasts,
    }}>
      {props.children}
    </ForecastsContext.Provider>
  );
}
