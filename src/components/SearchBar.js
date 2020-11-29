import React, {useContext, useEffect, useRef, useState} from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import styled from "styled-components";
import devices from "../devices";
import './SearchBar.css';
import {CSSTransition} from "react-transition-group";
import {WeatherContext} from "./WeatherContext";
import {getWeather} from "../api/get";
import {ForecastsContext} from "./ForecastsContext";

const SearchBarDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    top: ${({focused}) => (focused ? '100%' : '20%')};
    position: relative;
    margin: 0 auto;
    transition: 0.8s 0.1s;
    max-width: ${({focused}) => (focused ? '320px' : '220px')};
    @media ${devices.mobileM} {
      max-width: ${({focused}) => (focused ? '450px' : '300px')};
    }
    @media ${devices.mobileL} {
      max-width: ${({focused}) => (focused ? '500px' : '300px')};
    }
    @media ${devices.tablet} {
      max-width: ${({focused}) => (focused ? '600px' : '400px')};
    }
    @media ${devices.laptop} {
      max-width: ${({focused}) => (focused ? '700px' : '500px')};
    }
`;

const SearchBarInput = styled.input`
    width: 100%;
    border: none;
    background-color: #ffffff;
    font-size: 14px;
    padding: 10px 15px 10px 40px;
    color: #A0A0A0;
    &:focus {
      color: #202020;
    }
    @media ${devices.mobileL} {
      font-size: 16px;
    }
    @media ${devices.tablet} {
      font-size: 18px;
    }
    @media ${devices.laptop} {
      font-size: 20px;
    }
`;

const SearchBarIcon = styled.i`
  position: absolute;
  transition: 0.4s;
  font-size: 16px;
  left: 13px;
  top: 10px;
  color: #c5c5c5;
  @media ${devices.tablet} {
      font-size: 18px;
      left: 11px;
      top: 11px;
    }
  @media ${devices.laptop} {
    font-size: 20px;
    left: 11px;
    top: 11px;
  }
`;

const SuggestionsList = styled.ul`
    position: absolute;
    top: 100%;
    border-radius: 0 0 20px 20px;
    background-color: #ffffff;
    list-style: none inside;
    width: 100%;
    padding: 0 0 15px 0;
    transition: display 1s ease-in;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);
`

const SuggestionsListItem = styled.li`
    padding: 10px 0 10px 1.5em;
    transition: 0.2s;
    font-size: 14px;
    border-top: 1px solid #c5c5c5;
    @media ${devices.mobileL} {
      font-size: 16px;
    }
    @media ${devices.tablet} {
      font-size: 18px;
    }
    @media ${devices.laptop} {
      font-size: 20px;
    }
    &:last-child {
      border-bottom: 1px solid #c5c5c5;
    }
    &:hover {
      cursor: pointer;
      background-color: #c5c5c5;
    }
    &:before {
      content: "\\f041"; /* FontAwesome Unicode */
      font-family: FontAwesome, serif;
      display: inline-block;
      margin-left: -1em;
      width: 1em;
      color: red;
    }
`
const getWeatherData = (latLng) => {
  const {
    lat,
    lng
  } = latLng
  return Promise.all([getWeather(lat, lng, process.env.REACT_APP_WEATHER_API_KEY)])
    .then((data) => {
      return data;
    }).catch(error => {
      throw error;
    })
}

const SearchBar = () => {
  const searchOptions = {
    types: ['(cities)']
  }

  const [address, setAddress] = useState('');
  const [placeholder, setPlaceholder] = useState(["What's the weather in..."]);
  const [focused, setFocused] = useState(false);
  const iconRef = useRef(null);
  const inputRef = useRef(null);
  const {setWeather} = useContext(WeatherContext);
  const {setForecasts} = useContext(ForecastsContext);

  useEffect(() => {
    if (focused) {
      iconRef.current.style = 'color: #7FDBFF';
    } else {
      iconRef.current.style = SearchBarIcon.style;
    }
  })

  const handleFocus = (isFocused) => () => {
    setFocused(isFocused);
  };

  const handleChange = address => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    inputRef.current.blur();
    setAddress('');
    setPlaceholder(address);
    let city, country;
    try {
      city = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9_ ]*/.exec(address)[0].trim();
      country = /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9_ ]*$/.exec(address)[0].trim();
    } catch (error) {
      city = address;
      country = '';
    }
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => getWeatherData(latLng))
      .then(([weatherData]) => {
        setWeather({
          city: city,
          country: country,
          title: weatherData.current.weather[0].main,
          description: weatherData.current.weather[0].description,
          temp: weatherData.current.temp,
          pressure: weatherData.current.pressure,
          timezone: weatherData.timezone_offset,
          sunrise: weatherData.current.sunrise,
          sunset: weatherData.current.sunset,
        });
        setForecasts(weatherData.daily.slice(1).map(forecast => {
          return {
            title: forecast.weather[0].main,
            description: forecast.weather[0].description,
            tempDay: forecast.temp.day,
            tempEvening: forecast.temp.eve,
            tempNight: forecast.temp.night,
            tempMax: forecast.temp.max,
            timestamp: forecast.dt,
            pop: forecast.pop,
          };
        }))
      })
      .catch(error => console.error('Error', error));
  };


  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
      highlightFirstSuggestion={true}
    >
      {({getInputProps, suggestions, getSuggestionItemProps}) => (
        <CSSTransition timeout={200} classNames="search-box" appear={true} in={true}>
          <SearchBarDiv focused={focused}>
            <SearchBarIcon className="fa fa-search"
                           ref={iconRef}>
            </SearchBarIcon>
            <SearchBarInput
              {...getInputProps({
                placeholder: placeholder,
                className: focused ?
                  (suggestions.length > 0 ? 'focused-input-with-list' : 'focused-input-without-list')
                  : 'blurred-input',
                onFocus: handleFocus(true),
                onBlur: handleFocus(false),
                ref: inputRef,
              })}
            />
            {suggestions.length > 0 &&
            <SuggestionsList>
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : '';
                const mainText = suggestion.formattedSuggestion.mainText;
                const secondaryText = suggestion.formattedSuggestion.secondaryText;
                return (
                  <SuggestionsListItem key={suggestion.placeId}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <span><strong>{mainText}</strong>, {secondaryText}</span>
                  </SuggestionsListItem>
                );
              })}
            </SuggestionsList>}
          </SearchBarDiv>
        </CSSTransition>
      )}
    </PlacesAutocomplete>
  );
}


export default SearchBar;