import React from 'react'
import './App.css';
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import {WeatherProvider} from "./WeatherContext";
import {ForecastsProvider} from "./ForecastsContext";

const App = () => {

return (
  <WeatherProvider>
    <ForecastsProvider>
    <div className="App">
      <div className="topBox">
        <Logo/>
        <SearchBar/>
      </div>
      <div className='resultsBox'>
      </div>
    </div>
    </ForecastsProvider>
  </WeatherProvider>
  );
}

export default App;
