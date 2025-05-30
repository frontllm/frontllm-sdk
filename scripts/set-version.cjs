const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !(/^\d+\.\d+\.\d+$/.test(version))) {
	console.log('Usage: node set-version.js 1.2.3');
	return;
}

function resolvePath(filePath) {
	return path.join(__dirname, '..', filePath);
}

function updatePackage(filePath) {
	filePath = resolvePath(filePath);
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	json['version'] = version;

	fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'), 'utf-8');
}

function updateJsdelivrUrl(filePath) {
	filePath = resolvePath(filePath);
	let text = fs.readFileSync(filePath, 'utf-8');

	text = text.replace(/\/\/cdn\.jsdelivr\.net\/npm\/frontllm@\d+\.\d+\.\d+/g, (found) => {
		const parts = found.split('@');
		return `${parts[0]}@${version}`;
	});

	fs.writeFileSync(filePath, text, 'utf-8');
}

updatePackage('sdk/package.json', true);
updateJsdelivrUrl('README.md');
