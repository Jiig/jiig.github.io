import { actions } from "astro:actions";
import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import pkg from "@mdi/react";
const { Icon } = pkg;
import {
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiWeatherPartlyCloudy,
  mdiWeatherCloudy,
  mdiWeatherFog,
  mdiWeatherRainy,
  mdiWeatherPouring,
  mdiWeatherSnowyRainy,
  mdiWeatherSnowy,
  mdiWeatherLightningRainy,
  mdiWeatherLightning,
  mdiWeatherHail,
} from "@mdi/js";

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Updated function returning the raw path data object instead of a string
export function getWeatherIconPath(
  code: number,
  isNight: boolean = false,
): string {
  switch (code) {
    case 0:
      return isNight ? mdiWeatherNight : mdiWeatherSunny;
    case 1:
    case 2:
      return isNight ? mdiWeatherNight : mdiWeatherPartlyCloudy; // mdi lacks a unique night-partly-cloudy path sometimes, fallback to standard or night
    case 3:
      return mdiWeatherCloudy;
    case 45:
    case 48:
      return mdiWeatherFog;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return mdiWeatherRainy;
    case 61:
    case 63:
      return mdiWeatherRainy;
    case 65:
      return mdiWeatherPouring;
    case 66:
    case 67:
      return mdiWeatherSnowyRainy;
    case 71:
    case 73:
    case 75:
    case 77:
      return mdiWeatherSnowy;
    case 80:
    case 81:
    case 82:
      return mdiWeatherLightningRainy;
    case 85:
    case 86:
      return mdiWeatherSnowy;
    case 95:
      return mdiWeatherLightning;
    case 96:
    case 99:
      return mdiWeatherHail;
    default:
      return mdiWeatherCloudy;
  }
}

function WeatherData(data: any) {
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const utcOffsetSeconds = data.utcOffsetSeconds();
  const timezone = data.timezone();
  const timezoneAbbreviation = data.timezoneAbbreviation();
  const latitude = data.latitude();
  const longitude = data.longitude();

  const current = data.current();
  const hourly = data.hourly();
  const daily = data.daily();
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0).value(), // Current is only 1 value, therefore `.value()`
      weatherCode: current.variables(1).value(),
      windSpeed: current.variables(2).value(),
      windDirection: current.variables(3).value(),
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval(),
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature: hourly.variables(0).valuesArray(), // `.valuesArray()` get an array of floats
      precipitation: hourly.variables(1).valuesArray(),
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval(),
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      weatherCode: daily.variables(0).valuesArray(),
      temperatureMax: daily.variables(1).valuesArray(),
      temperatureMin: daily.variables(2).valuesArray(),
    },
  };
  return weatherData;
}

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = {
    latitude: [39.9936],
    longitude: [-105.0892],
    temperature_unit: "fahrenheit",
    current: "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const responses = await fetchWeatherApi(url, params);
        const resp = await responses[0];
        setWeather(WeatherData(resp));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold text-secondary">Weather</h2>
          {loading ? (
            <span>Loading data</span>
          ) : (
            <div className="flex items-center gap-2">
              <Icon
                path={getWeatherIconPath(weather?.current.weatherCode)}
                size={1}
              />
              <span className="text-xl">
                {weather?.current.temperature.toFixed(0)} °f
              </span>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button className="btn btn-primary btn-block">Subscribe</button>
        </div>
      </div>
    </div>
  );
}

export default Weather;
