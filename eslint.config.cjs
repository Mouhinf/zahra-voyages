const fs = require('fs');
const path = require('path');

// Load legacy .eslintrc.json and export as flat config for ESLint CLI compatibility
const raw = fs.readFileSync(path.resolve(__dirname, '.eslintrc.json'), 'utf8');
const config = JSON.parse(raw);

module.exports = config;
