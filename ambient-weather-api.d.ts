declare module 'ambient-weather-api' {
  interface AmbientWeatherOptions {
    apiKey: string;
    applicationKey: string;
  }

  interface DeviceOptions {
    limit?: number;
    endDate?: Date | string | number;
  }

  class AmbientWeatherApi {
    constructor(options: AmbientWeatherOptions);
    userDevices(): Promise<any[]>;
    deviceData(macAddress: string, options?: DeviceOptions): Promise<any[]>;
  }

  export default AmbientWeatherApi;
}
