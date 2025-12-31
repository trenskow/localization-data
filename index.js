import { countries, languages } from 'countries-list';
import merge from '@trenskow/merge';

import scripts from './dist/scripts.js';
import languagesScripts from './dist/languages-scripts.js';

export default merge({}, { countries }, {
	scripts: scripts,
	languages: merge(languages, languagesScripts)
});
