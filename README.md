# SL Weather

## Installation

```sh
git clone (this repo)
cd sl-weather
npm install
```

## Usage

```sh
# To start a server (defaults to port 8080)
node ./index.ts serve
node ./index.ts serve -p 3000

# To simply emit a file (defaults to stdout)
node ./index.ts emit
node ./index.ts emit -o ./outFile.html
```
