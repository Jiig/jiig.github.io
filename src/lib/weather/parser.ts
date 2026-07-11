import type { WeatherApiResponse as OpenMeteoWeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import type { VariablesWithTime } from "@openmeteo/sdk/variables-with-time";
import type { VariableWithValues } from "@openmeteo/sdk/variable-with-values";
import { CURRENT_FIELDS, DAILY_FIELDS, HOURLY_FIELDS } from "./api";
import type { WeatherState } from "./types";

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

function requireSection(
  section: VariablesWithTime | null,
  name: string,
): VariablesWithTime {
  if (!section) {
    throw new Error(`Weather API response missing ${name} section`);
  }
  return section;
}

function requireVariable(
  section: VariablesWithTime,
  index: number,
  name: string,
): VariableWithValues {
  const variable = section.variables(index);
  if (!variable) {
    throw new Error(
      `Weather API response missing ${name} variable at index ${index}`,
    );
  }
  return variable;
}

function createFieldIndexMap<T extends readonly string[]>(
  fields: T,
): Record<T[number], number> {
  return Object.fromEntries(
    fields.map((field, index) => [field, index] as const),
  ) as Record<T[number], number>;
}

function requireVariableByField<T extends readonly string[]>(
  section: VariablesWithTime,
  sectionName: string,
  fieldIndexMap: Record<T[number], number>,
  field: T[number],
): VariableWithValues {
  return requireVariable(
    section,
    fieldIndexMap[field],
    `${sectionName} ${field}`,
  );
}

function requireValuesArray(
  variable: VariableWithValues,
  name: string,
): Float32Array {
  const values = variable.valuesArray();
  if (!values) {
    throw new Error(`Weather API response missing ${name} values array`);
  }
  return values;
}

export function parseWeatherData(
  data: OpenMeteoWeatherApiResponse,
): WeatherState {
  const current = requireSection(data.current(), "current");
  const hourly = requireSection(data.hourly(), "hourly");
  const daily = requireSection(data.daily(), "daily");

  const currentFieldIndex = createFieldIndexMap(CURRENT_FIELDS);
  const hourlyFieldIndex = createFieldIndexMap(HOURLY_FIELDS);
  const dailyFieldIndex = createFieldIndexMap(DAILY_FIELDS);

  const currentTemperature = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "temperature_2m",
  );
  const currentWeatherCode = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "weather_code",
  );
  const currentWindSpeed = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "wind_speed_10m",
  );
  const currentWindDirection = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "wind_direction_10m",
  );
  const currentPrecipitationProbability = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "precipitation_probability",
  );
  const currentPrecipitationType = requireVariableByField(
    current,
    "current",
    currentFieldIndex,
    "precipitation",
  );
  const hourlyTemperature = requireVariableByField(
    hourly,
    "hourly",
    hourlyFieldIndex,
    "temperature_2m",
  );
  const hourlyPrecipitation = requireVariableByField(
    hourly,
    "hourly",
    hourlyFieldIndex,
    "precipitation",
  );
  const hourlyPrecipitationProbability = requireVariableByField(
    hourly,
    "hourly",
    hourlyFieldIndex,
    "precipitation_probability",
  );
  const hourlyWeatherCode = requireVariableByField(
    hourly,
    "hourly",
    hourlyFieldIndex,
    "weather_code",
  );
  const dailyWeatherCode = requireVariableByField(
    daily,
    "daily",
    dailyFieldIndex,
    "weather_code",
  );
  const dailyTemperatureMax = requireVariableByField(
    daily,
    "daily",
    dailyFieldIndex,
    "temperature_2m_max",
  );
  const dailyTemperatureMin = requireVariableByField(
    daily,
    "daily",
    dailyFieldIndex,
    "temperature_2m_min",
  );

  return {
    current: {
      time: new Date(Number(current.time()) * 1000),
      temperature: currentTemperature.value(),
      weatherCode: currentWeatherCode.value(),
      windSpeed: currentWindSpeed.value(),
      windDirection: currentWindDirection.value(),
      precipitationProbability: currentPrecipitationProbability.value(),
      precipitationType: currentPrecipitationType.value(),
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval(),
      ).map((t) => new Date(t * 1000)),
      temperature: requireValuesArray(hourlyTemperature, "hourly temperature"),
      precipitation: requireValuesArray(
        hourlyPrecipitation,
        "hourly precipitation",
      ),
      precipitationProbability: requireValuesArray(
        hourlyPrecipitationProbability,
        "hourly precipitation probability",
      ),
      weatherCode: requireValuesArray(hourlyWeatherCode, "hourly weather code"),
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval(),
      ).map((t) => new Date(t * 1000)),
      weatherCode: requireValuesArray(dailyWeatherCode, "daily weather code"),
      temperatureMax: requireValuesArray(
        dailyTemperatureMax,
        "daily max temperature",
      ),
      temperatureMin: requireValuesArray(
        dailyTemperatureMin,
        "daily min temperature",
      ),
    },
  };
}
