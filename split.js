const fs = require('fs');

let aptDat = fs.readFileSync('./data/apt.dat.txt').toString()
    .split(/\r?\n/).slice(4, -2);

let count = 0;
let apts = new Array(360).fill(null)
    .map(x => new Array(360).fill(null).map(x => []));

const getAptCenter = lines => {
    var f = [];
    for (let i = 0; i < lines.length; i++) {
        const row = lines[i];
        const split = row.split(/ +/);
        const rowCode = split[0];

        if (rowCode === '100') {
            const lat = split[9]
            const lng = split[10]
            f.push([lat, lng]);
            const lat2 = split[18]
            const lng2 = split[19]
            if (lat2 && lng2) f.push([lat2, lng2]);
        } else if (rowCode === '101') {
            const lat = split[4]
            const lng = split[5]
            f.push([lat, lng]);
            const lat2 = split[7]
            const lng2 = split[8]
            if (lat2 && lng2) f.push([lat2, lng2]);
        } else if (rowCode === '102') {
            const lat = split[2]
            const lng = split[3]
            f.push([lat, lng]);
        }
    }

    if (f.length === 0) throw 'No runways'

    const avglat = f.map(x => +x[0]).reduce((a, b) => a + b) / f.length;
    const avglng = f.map(x => +x[1]).reduce((a, b) => a + b) / f.length;
    return [avglat, avglng];
}

for (let i = 0; i < aptDat.length; i++) {
    const rowCode = aptDat[i].split(' ')[0];
    if (rowCode === '1' || rowCode === '16' || rowCode === '17') {
        if (count > 0) {
            const lines = aptDat.slice(count, i).filter(x => x.trim());
            const split = lines[0].split(/ +/);
            const mid = getAptCenter(lines);
            const taxiRouteNetwork = lines.find(l => l.trim() === '1200');
            apts[Math.floor(+mid[0]) + 180][Math.floor(+mid[1]) + 180].push({
                lat: mid[0],
                lng: mid[1],
                icao: split[4],
                taxiRouteNetwork,
                name: split.slice(5).join(' '),
                lines: lines,
            });
        }
        count = i;
    }
}
(function () {
    const lines = aptDat.slice(count, -1).filter(x => x.trim());
    const split = lines[0].split(/ +/);
    const mid = getAptCenter(lines);
    const taxiRouteNetwork = lines.find(l => l.trim() === '1200');
    apts[Math.floor(+mid[0]) + 180][Math.floor(+mid[1]) + 180].push({
        lat: mid[0],
        lng: mid[1],
        icao: split[4],
        taxiRouteNetwork,
        name: split.slice(5).join(' '),
        lines: lines,
    });
})();

if (!fs.existsSync('data/airports')) fs.mkdirSync('data/airports');
Object.keys(apts).map(lat => {
    if (!fs.existsSync(`data/tiles/${lat}`)) fs.mkdirSync(`data/tiles/${lat}`);
    Object.keys(apts[lat]).map(lng => {
        const lines = apts[lat][lng].map(x => x.lines.join('\n')).join('\n');
        fs.writeFileSync(`data/tiles/${lat}/${lng}.dat.txt`, lines);
        apts[lat][lng].map(apt => {
            fs.writeFileSync(`data/airports/${apt.icao}.dat.txt`, apt.lines.join('\n'));
        });
    });
});

const aptNavDat = [];

Object.keys(apts).map(lat => {
    Object.keys(apts[lat]).map(lng => {
        const dat = apts[lat][lng];
        if (dat.length === 0) return;
        dat.forEach(a =>
            aptNavDat.push([a.icao, a.lat.toFixed(8), a.lng.toFixed(8), a.taxiRouteNetwork ? 1 : 0, a.name].join(' ')));
    });
});

aptNavDat.sort();

fs.writeFileSync(`data/apt_nav.dat.txt`, aptNavDat.join('\n'));


