import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      'quotes': [2, 'single', { 'avoidEscape': true }]
    }
  },
  { ignores: ['test/data.js'] } // formatted like a json file, easier to convert between formats
];