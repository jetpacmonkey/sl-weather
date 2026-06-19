#! /usr/bin/env node
import 'dotenv/config';

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

function assertNever(mode: never) {
  throw Error(`Unchecked mode: ${mode}`);
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

  assertNever(mode);
}

let conf;
try {
  conf = parseArgs();
} catch (e) {
  console.debug(e);
  console.log('Usage:');
  console.log('  node ./index.ts serve');
  console.log('  node ./index.ts emit -o myFile.html');
  process.exit(1);
}

if (conf.mode === 'serve') {
  // create http server, call render in it
} else if (conf.mode === 'emit') {
  // call render and send it to conf.outFile
} else {
  assertNever(conf.mode);
}
