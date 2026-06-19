#! /usr/bin/env node
import 'dotenv/config';

type Config =
  | {
      mode: 'serve';
    }
  | {
      mode: 'emit';
      outFile: string | typeof process.stdout;
    };

function isValidMode(maybeMode: string): maybeMode is Config['mode'] {
  return maybeMode === 'serve' || maybeMode === 'emit';
}

function assertNever(mode: never) {
  throw Error(`Unchecked mode: ${mode}`);
}

function parseArgs(args = process.argv): Config {
  const [, , mode = 'emit', ...rest] = args;
  if (!isValidMode(mode)) {
    throw Error(`Mode not recognize: ${mode}`);
  }

  if (mode === 'emit') {
    const outFile = rest[0] === '-o' ? rest[1] : undefined;
    return { mode, outFile: outFile ?? process.stdout };
  }
  return { mode };
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
