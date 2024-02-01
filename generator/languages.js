'use strict';

const { languages: languagesAll, countries } = require('countries-list');

const { promisify } = require('util');
const fs = require('fs');
const xml2js = require('xml2js');

const macros = {
	'nb': ['nb','no']
};

module.exports = exports = () => {

	return promisify(fs.readFile)(__dirname + '/data/languages.xml')
		.then((languagesXml) => {
			const parser = new xml2js.Parser();
			return promisify(parser.parseString)(languagesXml);
		})
		.then((data) => {
			return data.languageData.language.map((language) => language.$);
		})
		.then((languages) => {

			const scripts = require('../dist/scripts.json');

			return languages
				.filter((language) => languagesAll[language.type])
				.filter((language) => language.scripts)
				.map((language) => {
					if (language.scripts) language.scripts = language.scripts.split(' ');
					if (language.territories) language.territories = language.territories.split(' ');
					return language;
				})
				.reduce((res, language) => {
					const types = macros[language.type] || [language.type];
					types.forEach((type) => {
						res[type] = res[type] || {
							scripts: {}
						};
						language.scripts.forEach((script) => {
							if (!scripts[script]) {
								if (process.argv[2] === 'debug') console.error(script);
								return;
							}
							language.territories = language.territories || Object.keys(countries).filter((country) => {
								return countries[country].languages.includes(type);
							});
							if (language.alt !== 'secondary') {
								res[type].primaryScripts = res[type].primaryScripts || [];
								res[type].primaryScripts.push(script);
							}
							res[type].scripts[script] = {
								countries: language.territories.filter((country) => {
									return countries[country];
								})
							};
						});
					});
					return res;
				}, {});

		}).
		then((languages) => {
			return JSON.stringify(languages);
		})
		.then((languagesJson) => {
			return promisify(fs.writeFile)(__dirname + '/../dist/languages-scripts.json', languagesJson);
		});

};
