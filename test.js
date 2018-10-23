const readlineSync = require('readline-sync');
const { parseAptNav, parseApt } = require('./lib/spec');
const { apt_nav, apts_sliced } = require('./lib/repository');
const { mkGraph } = require('./lib/gnd_graph');
const { apt } = require('./lib/apt');
const { dump } = require('./lib/util');
const fs = require('fs');

const icao = readlineSync.question('airport? ');

const graph = mkGraph(icao);
const airport = apt(icao);

dump(icao, airport);

console.log('done');

const apt_short = parseAptNav(apt_nav()).find(apt => apt.identifier === icao.toUpperCase());
const sliced = apts_sliced(apt_short.lat, apt_short.lng);

fs.writeFileSync('dump', sliced);