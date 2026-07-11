import React, { useState, useEffect } from "react";
import { fetchCurrentWeather } from "../lib/weather/api";
import { getWeatherIconPath } from "../lib/weather/icons";
import { parseWeatherData } from "../lib/weather/parser";
import type { WeatherState } from "../lib/weather/types";

function Weather() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const isDev = import.meta.env.DEV;
  const weatherUrl = "https://www.wunderground.com";

  const nextFourHours = weather
    ? weather.hourly.time
        .map((time, index) => ({
          time,
          temperature: weather.hourly.temperature[index],
          weatherCode: weather.hourly.weatherCode[index],
          precipitationProbability:
            weather.hourly.precipitationProbability[index],
        }))
        .filter((hour) => hour.time.getTime() >= Date.now())
        .slice(0, 4)
    : [];

  const hourLabelFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetchCurrentWeather();
        setWeather(parseWeatherData(response));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchWeather();
  }, []);

  const handleCardClick = () => {
    if (isDev) {
      window.open(weatherUrl);
    } else {
      window.open(weatherUrl, "_self");
    }
  };

  return (
    <div
      className="card w-[38rem] max-w-full cursor-pointer bg-base-100 shadow-sm"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
      aria-label="Open Wunderground"
    >
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold text-secondary">Weather</h2>
          {loading ? (
            <span>Loading data</span>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                role="img"
                aria-label="Current weather icon"
              >
                <path
                  fill="currentColor"
                  d={getWeatherIconPath(weather?.current.weatherCode ?? 3)}
                />
              </svg>
              <span className="text-xl">
                {weather?.current.temperature?.toFixed(0) ?? "--"}° F
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <span className="col-span-2 text-sm text-base-content/70">
              Loading forecast...
            </span>
          ) : nextFourHours.length > 0 ? (
            nextFourHours.map((hour) => (
              <div
                key={hour.time.toISOString()}
                className="rounded-box bg-base-200 p-3"
              >
                <div className="text-xs font-semibold text-base-content/70">
                  {hourLabelFormatter.format(hour.time)}
                </div>
                <div className="mt-1 justify-between flex items-center">
                  <span className="text-lg font-semibold">
                    {Number(hour.temperature).toFixed(0)}° F
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    role="img"
                    aria-label="Forecast weather icon"
                  >
                    <path
                      fill="currentColor"
                      d={getWeatherIconPath(Number(hour.weatherCode) || 3)}
                    />
                  </svg>
                </div>
                <div className="mt-1 text-xs text-base-content/80">
                  <span>
                    Per: &nbsp;&nbsp;&nbsp;
                    {Number(hour.precipitationProbability).toFixed(0)}%{" "}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span className="col-span-2 text-sm text-base-content/70">
              Forecast unavailable.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;
