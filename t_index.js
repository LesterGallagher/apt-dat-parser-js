const fs = require('fs');
const xmldom = require('xmldom');
const fetch = require('node-fetch');
const { parseNav, parseAwy, parseFix } = require('./spec');

const navData = parseNav(fs.readFileSync('data/earth_nav.dat').toString());
const fixData = parseFix(fs.readFileSync('data/earth_fix.dat').toString());
const awyData = parseAwy(fs.readFileSync('data/earth_awy.dat').toString());

console.log(navData.slice(12000, 12001));
console.log(fixData.slice(12000, 12001));
console.log(awyData.slice(12000, 12001));

