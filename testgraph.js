const readlineSync = require('readline-sync');
const { parseAptNav, parseApt } = require('./lib/spec');
const { apt_nav, apts_sliced, apt_icao } = require('./lib/repository');
const { findPath } = require('./lib/gnd_graph');
const { dump } = require('./lib/util');

const icao = readlineSync.question('airport? ');

const apt = parseApt(apt_icao(icao), true)[0];

findPath(apt);

