import AmbientWeatherApi from 'ambient-weather-api';
import type { EnvValues } from './types.ts';

let _api: AmbientWeatherApi;
function getApi(env: Readonly<Pick<EnvValues, 'API_KEY' | 'APPLICATION_KEY'>>) {
  return (_api ??= new AmbientWeatherApi({
    apiKey: env.API_KEY,
    applicationKey: env.APPLICATION_KEY,
  }));
}

export default async function render(
  env: Readonly<EnvValues>,
): Promise<string> {
  const api = getApi(env);
  const data = await api.deviceData(env.DEVICE_ID, { limit: 288 });
  return `<html>
<pre>${JSON.stringify(data, undefined, 2)}</pre>
</html>
`;
}
