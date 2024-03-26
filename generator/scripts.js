'use strict';

const fs = require('fs');
const readline = require('readline');

module.exports = exports = () => {

	return new Promise((resolv, reject) => {

		const rl = readline.createInterface(fs.createReadStream(__dirname + '/data/scripts.csv'));

		let all = [];

		rl.on('line', (line) => {
			let inside = false;
			line = line.split('')
				.map((char) => {
					if (char == '"') {
						inside = !inside;
						return;
					}
					if (inside) return char;
					if (char == ',') return '|||';
					return char;
				}).join('');
			all.push(line.split('|||'));
		});

		const convertDirection = (dir) => {
			switch (dir) {
			case 'right-to-left':
				return 'rl';
			case 'left-to-right':
				return 'lr';
			case 'top-to-bottom':
				return 'tb';
			default:
				return dir.toLowerCase();
			}
		};

		rl.on('close', () => {
			fs.writeFile(
				__dirname + '/../dist/scripts.json',
				JSON.stringify(all
					.filter((line) => {
						const include = line[4];
						if (!include && process.argv[2] == '--debug') console.error(`Dropped ${line[0]} (missing data)`, JSON.stringify(line));
						return include;
					})
					.filter((line) => {
						const include = !/ancient/i.test(line);
						if (!include && process.argv[2] == '--debug') console.error(`Dropped ${line[0]} (ancient)`);
						return include;
					})
					.filter((line) => {
						// All above code 900 are reserved for private use in the ISO.
						return parseInt(line[1]) < 900;
					})
					.map((line) => {
						return {
							code: line[0],
							no: line[1],
							name: line[2],
							direction: convertDirection(line[3].split(/[, ]/)[0])
						};
					})
					.reduce((res, script) => {
						res[script.code] = {
							no: script.no,
							name: script.name,
							direction: script.direction
						};
						return res;
					}, {})),
				(err) => {
					if (err) return reject(err);
					resolv();
				});
		});

	});

};
