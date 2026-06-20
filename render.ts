import AmbientWeatherApi, { type DeviceData } from 'ambient-weather-api';
import type { EnvValues } from './types.ts';

let _api: AmbientWeatherApi;
function getApi(env: Readonly<Pick<EnvValues, 'API_KEY' | 'APPLICATION_KEY'>>) {
  return (_api ??= new AmbientWeatherApi({
    apiKey: env.API_KEY,
    applicationKey: env.APPLICATION_KEY,
  }));
}

interface Card {
  label: string;
  value: number;
  unit?: string;
}

function buildCards(data: readonly DeviceData[]): Card[] {
  const cards: Card[] = [];

  const latestData = data.reduce((latest, current) =>
    latest.dateutc > current.dateutc ? latest : current,
  );

  cards.push({
    label: 'Temperature',
    value: latestData.tempf,
    unit: ' ºF',
  });

  cards.push({
    label: 'Humidity',
    value: latestData.humidity,
    unit: '%',
  });

  return cards;
}

function renderCard(card: Card) {
  return `  <div class="card">
    <div class="label">${card.label}</div>
    <div class="value" ${card.unit ? ` data-unit="${card.unit}"` : ''}>${card.value}</div>
</div>`;
}

export default async function render(
  env: Readonly<EnvValues>,
): Promise<string> {
  const api = getApi(env);
  const data = await api.deviceData(env.DEVICE_ID, { limit: 1 });

  const cards = buildCards(data);

  return `<!DOCTYPE html>
<html>
<head>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
    }

    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
    }

    .card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 10px;
      flex: 1;
      max-width: 300px;
      box-shadow: 2px 4px 8px #333;
      border-radius: 4px;

      display: flex;
      flex-direction: column;
    }

    .label {
      font-weight: bold;
      text-align: left;
      font-size: 1.5em;
    }

    .value {
      font-weight: bold;
      text-align: center;
      font-size: 3em;
    }

    .value[data-unit]::after {
      content: attr(data-unit);
      font-size: 1rem;
    }
  </style>
</head>
<body>
<div class="grid">
${cards.map((card) => renderCard(card)).join('\n')}
</div>
<pre>${JSON.stringify(data, undefined, 2)}</pre>
</body>
</html>
`;
}
