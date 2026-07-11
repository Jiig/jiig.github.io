import { fetchWeatherApi } from "openmeteo";
import type { WeatherApiResponse as OpenMeteoWeatherApiResponse } from "@openmeteo/sdk/weather-api-response";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const CURRENT_FIELDS = [
  "temperature_2m",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "precipitation_probability",
  "precipitation",
] as const;

export const HOURLY_FIELDS = [
  "temperature_2m",
  "precipitation",
  "precipitation_probability",
  "weather_code",
] as const;

export const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
] as const;

const WEATHER_PARAMS = {
  latitude: [39.9936],
  longitude: [-105.0892],
  temperature_unit: "fahrenheit",
  current: CURRENT_FIELDS.join(","),
  hourly: HOURLY_FIELDS.join(","),
  daily: DAILY_FIELDS.join(","),
};

export async function fetchCurrentWeather(): Promise<OpenMeteoWeatherApiResponse> {
  const responses = await fetchWeatherApi(WEATHER_API_URL, WEATHER_PARAMS);
  const response = responses[0];

  if (!response) {
    throw new Error("Weather API returned no response");
  }

  return response;
}
