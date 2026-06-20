declare module 'ambient-weather-api' {
  interface AmbientWeatherOptions {
    apiKey: string;
    applicationKey: string;
  }

  interface DeviceOptions {
    limit?: number;
    endDate?: Date | string | number;
  }

  /** See https://github.com/ambient-weather/api-docs/wiki/Device-Data-Specs for full list */
  export interface DeviceData {
    /** Datetime, int (milliseconds from 01-01-1970, rounded down to nearest minute on server) */
    dateutc: number;

    /** Outdoor Temperature, ºF */
    tempf: number;

    /** Indoor Temperature, ºF */
    tempinf: number;

    /** Outdoor Humidity, 0-100% */
    humidity: number;

    /** Hourly Rain Rate, in/hr */
    hourlyrainin: number;

    /** Daily Rain, in */
    dailyrainin: number;

    /** 24 Hour Rain, in */
    '24hourrainin': number;

    /** Weekly Rain, in */
    weeklyrainin: number;

    /** Monthly Rain, in */
    monthlyrainin: number;

    /** Yearly Rain, in */
    yearlyrainin: number;

    /** Ultra-Violet Radiation Index, integer on all devices _EXCEPT_ WS-8478. */
    uv: number;
  }

  class AmbientWeatherApi {
    constructor(options: AmbientWeatherOptions);
    userDevices(): Promise<any[]>;
    deviceData(
      macAddress: string,
      options?: DeviceOptions,
    ): Promise<DeviceData[]>;
  }

  export default AmbientWeatherApi;
}
