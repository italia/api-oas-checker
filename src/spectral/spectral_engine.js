import {Ruleset, Spectral} from '@stoplight/spectral-core';
import {Yaml} from '@stoplight/spectral-parsers';
import {oas} from '@stoplight/spectral-rulesets';
import * as spectralFunctions from '@stoplight/spectral-functions';
import * as spectralFormats from '@stoplight/spectral-formats';
import axios from 'axios';

/**
 * Singleton instance of the Spectral engine.
 */
const spectral = new Spectral();

/**
 * Tracks the currently loaded ruleset URL to avoid redundant reloads.
 */
let currentRulesetUrl = null;

/**
 * Map of custom functions loaded dynamically from the rulesets/functions directory.
 * These are discovered at build time via Webpack's require.context.
 */
const customFunctions = {};

try {
	/**
	 * Dynamically discover and load all .js files in ../../rulesets/functions.
	 * context.keys() returns paths like "./checkSecurity.js".
	 */
	const context = require.context('../../rulesets/functions', false, /\.js$/);
	context.keys().forEach((key) => {
		const functionName = key.replace(/^\.\//, '').replace(/\.js$/, '');
		const module = context(key);
		// Handle both ES modules (default export) and CommonJS exports
		customFunctions[functionName] = module.default || module;
	});
} catch (e) {
	// Directory might be missing or empty in some environments
	console.info('No custom ruleset functions loaded:', e.message);
}

/**
 * Replaces function names (strings) in rule definitions with their actual implementations.
 * Searches both built-in Spectral functions and dynamically loaded custom functions.
 *
 * @param {Object} rules - The rules object from the Spectral ruleset definition.
 */
const resolveRulesetFunctions = (rules) => {
	if (!rules) return;

	Object.entries(rules).forEach(([ruleName, rule]) => {
		if (!rule.then) return;

		const actions = Array.isArray(rule.then) ? rule.then : [rule.then];
		actions.forEach((action) => {
			if (typeof action.function === 'string') {
				const funcName = action.function;

				if (spectralFunctions[funcName]) {
					action.function = spectralFunctions[funcName];
					console.debug(`[Spectral] Rule "${ruleName}": resolved built-in function "${funcName}"`);
				} else if (customFunctions[funcName]) {
					action.function = customFunctions[funcName];
					console.debug(`[Spectral] Rule "${ruleName}": resolved custom function "${funcName}"`);
				} else {
					console.warn(`[Spectral] Rule "${ruleName}": function "${funcName}" not found in built-ins or custom functions.`);
				}
			}
		});
	});
};

/**
 * Replaces format names (strings) in rule definitions with their actual implementations.
 *
 * @param {Object} rules - The rules object from the Spectral ruleset definition.
 */
const resolveRulesetFormats = (rules) => {
	if (!rules) return;

	Object.values(rules).forEach((rule) => {
		if (rule.formats && Array.isArray(rule.formats)) {
			rule.formats = rule.formats.map((format) => {
				if (typeof format === 'string' && spectralFormats[format]) {
					return spectralFormats[format];
				}
				return format;
			});
		}
	});
};

/**
 * Prepares and cleans the ruleset data for instantiation.
 *
 * @param {Object} data - Raw ruleset data from YAML.
 * @returns {Object} Processed ruleset data.
 */
const prepareRulesetData = (data) => {
	if (!data) return null;

	// Resolve 'spectral:oas' shorthand to the actual OAS ruleset object
	if (data.extends === 'spectral:oas') {
		data.extends = oas;
	} else if (Array.isArray(data.extends)) {
		data.extends = data.extends.map((ext) => (ext === 'spectral:oas' ? oas : ext));
	}

	// Inject implementations for functions and formats
	if (data.rules) {
		resolveRulesetFunctions(data.rules);
		resolveRulesetFormats(data.rules);
	}

	/**
	 * Remove the 'functions' property to avoid schema validation errors during
	 * Ruleset instantiation, as we've already resolved them manually.
	 */
	if (data.functions) {
		delete data.functions;
	}

	return data;
};

/**
 * Retrieves a configured Spectral engine instance.
 * If the requested ruleset is already loaded, returns the existing instance.
 *
 * @param {string} rulesetUrl - The URL of the ruleset to load.
 * @returns {Promise<Spectral>} A promise that resolves to the Spectral instance.
 */
export const getSpectralEngine = async (rulesetUrl) => {
	if (rulesetUrl === currentRulesetUrl) {
		return spectral;
	}

	try {
		const response = await axios.get(rulesetUrl, {responseType: 'text'});
		const parsedYaml = Yaml.parse(response.data);
		const rulesetData = prepareRulesetData(parsedYaml.data);

		if (!rulesetData) {
			throw new Error('Ruleset definition is empty or invalid.');
		}

		const rulesetInstance = new Ruleset(rulesetData, {source: rulesetUrl});
		spectral.setRuleset(rulesetInstance);
		currentRulesetUrl = rulesetUrl;

		console.info(`[Spectral] Ruleset loaded successfully: ${rulesetUrl}`);
		return spectral;
	} catch (error) {
		console.error(`[Spectral] Failed to load ruleset from ${rulesetUrl}:`, error);
		if (error.errors) {
			console.error('[Spectral] Ruleset validation errors:', error.errors);
		}
		throw error;
	}
};
