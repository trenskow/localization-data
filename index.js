'use string';

const
	countriesList = require('countries-list'),
	merge = require('merge');

const
	scripts = require('./dist/scripts.json'),
	languagesScripts = require('./dist/languages-scripts.json');

module.exports = merge({}, countriesList, {
	scripts: scripts,
	languages: merge.recursive(countriesList.languages, languagesScripts)
});
