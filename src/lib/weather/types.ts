export type WeatherState = {
  current: {
    time: Date;
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    precipitationProbability: number;
    precipitationType: number;
  };
  hourly: {
    time: Date[];
    temperature: Float32Array;
    precipitation: Float32Array;
    precipitationProbability: Float32Array;
    weatherCode: Float32Array;
  };
  daily: {
    time: Date[];
    weatherCode: Float32Array;
    temperatureMax: Float32Array;
    temperatureMin: Float32Array;
  };
};
