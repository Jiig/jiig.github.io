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

export function getWeatherIconPath(
  code: number,
  isNight: boolean = false,
): string {
  switch (code) {
    case 0:
      return isNight ? mdiWeatherNight : mdiWeatherSunny;
    case 1:
    case 2:
      return isNight ? mdiWeatherNight : mdiWeatherPartlyCloudy;
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
