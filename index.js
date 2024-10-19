import { readFileSync } from 'fs';
import { join } from 'path';

import { countries, languages } from 'countries-list';
import merge from 'merge';

const scripts = JSON.parse(readFileSync(join(import.meta.dirname, 'dist', 'scripts.json'), 'utf8'));
const languagesScripts = JSON.parse(readFileSync(join(import.meta.dirname, 'dist', 'languages-scripts.json'), 'utf8'));

export default merge({}, countries, {
	scripts: scripts,
	languages: merge.recursive(languages, languagesScripts)
});
