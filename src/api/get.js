import fetchResource from "./fetchResource";

export const getWeather = (lat, lng, APIkey) => {
  return fetchResource(`onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&appid=${APIkey}&units=metric`);
}
