/* jQuery required for tests, which requires a full DOM */
var jquery = require('jquery');
/* XHTML/1.1-compatible, minimal, HTML document */
var minHTML = '<html><head><title>testsuite</title></head><body><p>Hello, World!</p></body></html>';

/* inject parse5 into the global Node.JS module loader */
var Module = require('module').Module;
var mods = {
	"parse5": "/external/parse5/index.js",
	"xml-name-validator": "/external/xml-name-validator/lib/xml-name-validator.js"
};
var oldResolveFilename = Module._resolveFilename;
var cwd = process.cwd();
Module._resolveFilename = function _resolveFilename_patched(request, parent, isMain) {
	if (mods[request])
		request = cwd + mods[request];
	return (oldResolveFilename(request, parent, isMain));
};

/* load jsdom and instantiate a DOM */
var jsdom = require('../external/jsdom-no-contextify/lib/jsdom.js');
var doc = jsdom.jsdom(minHTML);

/* instantiate jQuery with the (virtual) DOM */
var jQueryInstance = jquery(doc.parentWindow);
global.$ = jQueryInstance;

/* make future require('jquery') calls return that instance */
var Req = Module.prototype.require;
Module.prototype.require = function patchedRequire(name) {
	if (name == 'jquery')
		return jQueryInstance;
	return Req.apply(this, arguments);
};

/* load test suite stuff */
global.expect = require("chai").expect
