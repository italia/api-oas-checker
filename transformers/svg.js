/*
MIT License - Copyright (c) 2020 half-halt

Original repository: https://github.com/half-halt/svg-jest
Modified by Yannick (https://github.com/ls-yannick) in order to support Jest 28
*/

const path = require('path');

function buildModule(functionName, pathname, filename)
{
	return `
const React = require('react');
const ${functionName} = (props) => 
{
  	return React.createElement('svg', { 
  		...props, 
		'data-jest-file-name': '${pathname}',
		'data-jest-svg-name': '${filename}',
		'data-testid': '${filename}'
	});
}
module.exports.default = ${functionName};
module.exports.ReactComponent = ${functionName};
`;
}

function createFunctionName(base)
{
	const words = base.split(/\W+/);
	return words.reduce(
		(identifer, word) => {
			return identifer + 
				word.substr(0, 1).toUpperCase() +
				word.substr(1);
		}, '');
}

function processSvg(contents, filename)
{
	const parts = path.parse(filename);
	if (parts.ext.toLowerCase() === '.svg')
	{
		const functionName = createFunctionName(parts.name);
		return { code: buildModule(functionName, parts.base, parts.name) };
	}
	
	return { code: contents };
}

module.exports = 
{
	process: processSvg
}