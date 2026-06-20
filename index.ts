#! /usr/bin/env node
import 'dotenv/config';
import render from './render.ts';
import type { EnvValues } from './types.ts';
import { createWriteStream } from 'node:fs';
import { createServer } from 'node:http';

type Config =
  | {
      mode: 'serve';
      port: number;
    }
  | {
      mode: 'emit';
      outFile: string | typeof process.stdout;
    };

const DEFAULT_PORT = 8080;

function isValidMode(maybeMode: string): maybeMode is Config['mode'] {
  return maybeMode === 'serve' || maybeMode === 'emit';
}

function assertNever(mode: never): never {
  throw Error(`Unexpected value: ${JSON.stringify(mode)}`);
}

function parseArgs(args = process.argv): Config {
  const [, , mode = 'emit', ...rest] = args;
  if (!isValidMode(mode)) {
    throw Error(`Mode not recognized: ${mode}`);
  }

  if (mode === 'emit') {
    const outFile = rest[0] === '-o' ? rest[1] : undefined;
    return { mode, outFile: outFile ?? process.stdout };
  }

  if (mode === 'serve') {
    const port = rest[0] === '-p' ? parseInt(rest[1], 10) : undefined;
    if (port != null && isNaN(port)) {
      throw Error(`Could not parse port number: ${rest[1]}`);
    }
    return { mode, port: port ?? DEFAULT_PORT };
  }

  return assertNever(mode);
}

function getConf() {
  try {
    return parseArgs();
  } catch (e) {
    console.debug(e);
    console.log('Usage:');
    console.log('  node ./index.ts serve');
    console.log('  node ./index.ts emit -o myFile.html');
    process.exit(1);
  }
}

function getEnvValues(): EnvValues {
  const returnVal = {} as EnvValues;
  for (const key of ['API_KEY', 'APPLICATION_KEY', 'DEVICE_ID'] as const) {
    const val = process.env[key];
    if (val == null) {
      throw Error(`Missing required environment value "${key}"`);
    }
    returnVal[key] = val;
  }
  return returnVal;
}

const conf = getConf();
const env: Readonly<EnvValues> = getEnvValues();

if (conf.mode === 'serve') {
  // create http server, call render in it
  const server = createServer(async (req, res) => {
    const url = new URL(`http://localhost:${conf.port}${req.url ?? ''}`);
    if (req.method !== 'GET') {
      res.writeHead(405, { 'content-type': 'text/plain' });
      res.end('Only GET requests are allowed');
      return;
    }

    if (url.pathname !== '/') {
      console.log('Page not found', url.pathname);
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    try {
      const body = await render(env);
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(body);
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('An unexpected error occurred.');
    }
  });

  server.listen(conf.port);
  console.log(`Listening on port ${conf.port}...`);
} else if (conf.mode === 'emit') {
  // call render and send it to conf.outFile
  const html = await render(env);
  const stream =
    typeof conf.outFile === 'string'
      ? createWriteStream(conf.outFile)
      : conf.outFile;

  stream.write(html);

  if (!('fd' in stream) || stream.fd !== 1) {
    // Don't call .end() on stdout
    stream.end();
  }
} else {
  assertNever(conf);
}
