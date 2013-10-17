'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var FrontendGenerator = module.exports = function FrontendGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
	this.mainJsFile = '';

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FrontendGenerator, yeoman.generators.Base);

FrontendGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);
	console.log('Out of the box I include HTML5 Boilerplate, jQuery and Modernizr.');

	var prompts = [
		{
			type: 'list',
			name: 'frameworkChoice',
			message: 'Would you like to include a CSS framework?',
			choices: [
				{
					name: 'No Framework',
					value: 'noframework'
				},
				{
					name: 'Twitter Bootstrap',
					value: 'bootstrap'
				},
				{
					name: 'PureCSS',
					value: 'pure'
				},
				{
					name: 'Foundation',
					value: 'foundation'
				}
			]
		},
		{
			type: 'list',
			name: 'preprocessorChoice',
			message: 'Would you like to use a CSS preprocessor?',
			choices: [
				{
					name: 'No Preprocessor',
					value: 'nopreprocessor'
				},
				{
					name: 'Less',
					value: 'less'
				},
				{
					name: 'Sass',
					value: 'sass'
				}
			]
		},
		{
			type: 'list',
			name: 'testChoice',
			message: 'Which Test Framework would you like to use?',
			choices: [
				{
					name: 'Mocha',
					value: 'mocha'
				},
				{
					name: 'Jasmine',
					value: 'jasmine'
				},
				{
					name: 'Qunit',
					value: 'qunit'
				}
			]
		}
	];

	function getChoice(props, key, def) {
		var choices = props[key],
			result = def || null;

		for (var i = 0; i < prompts.length; i++) {
			var p = prompts[i];
			if (p.name === key && p.type === 'list') {
				for (var j = 0; j < p.choices.length; j++) {
					if (choices.indexOf(p.choices[j].value) !== -1) {
						return p.choices[j].value;
					}
				}
			}
		}
		return result;
	}

	this.prompt(prompts, function (props) {
		// manually deal with the response, get back and store the results.
		// we change a bit this way of doing to automatically do this in the self.prompt() method.
		this.includeRequireJS = props.includeRequireJS;
		this.frameworkSelected = getChoice(props, 'frameworkChoice', 'noframework');
		this.preprocessorSelected = getChoice(props, 'preprocessorChoice', 'nopreprocessor');
		this.testFramework = getChoice(props, 'testChoice', 'mocha');
		this.layoutChoice = props.layoutChoice;

		cb();
	}.bind(this));
};


// ----------------------------------------------------------------
// Layouts
// ----------------------------------------------------------------


// ----------------------------------------------------------------

FrontendGenerator.prototype.gruntfile = function gruntfile() {
	this.template('Gruntfile.js');
};

FrontendGenerator.prototype.packageJSON = function packageJSON() {
	this.template('_package.json', 'package.json');
};


FrontendGenerator.prototype.git = function git() {
	this.copy('gitignore', '.gitignore');
	this.copy('gitattributes', '.gitattributes');
};

FrontendGenerator.prototype.bower = function bower() {
	this.copy('bowerrc', '.bowerrc');
	this.copy('_bower.json', 'bower.json');
};

FrontendGenerator.prototype.jshint = function jshint() {
	this.copy('jshintrc', '.jshintrc');
};

FrontendGenerator.prototype.editorConfig = function editorConfig() {
	this.copy('editorconfig', '.editorconfig');
};

FrontendGenerator.prototype.h5bp = function h5bp() {
	this.copy('404.html', 'app/404.html');
	this.copy('robots.txt', 'app/robots.txt');
	this.copy('htaccess', 'app/.htaccess');
};

FrontendGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('editorconfig', '.editorconfig');
	this.copy('jshintrc', '.jshintrc');
};


FrontendGenerator.prototype.requirejs = function requirejs() {
	var requiredScripts = ['app', 'jquery'];
	var templateLibraryPath;
	var templateLibraryShim;
	if(this.frameworkSelected == 'bootstrap') {
		requiredScripts.push('bootstrap');
		templateLibraryPath = ',\n        bootstrap: \'..bower_components/bootstrap/dist/js/bootstrap\'\n    },';
		templateLibraryShim = '        bootstrap: {deps: [\'jquery\'], exports: \'jquery\'}';
	} else if(this.frameworkSelected == 'foundation') {
		requiredScripts.push('foundation/foundation');
		templateLibraryPath = ',\n        foundation: \'../bower_components/foundation/js/foundation\'\n    },';
		templateLibraryShim = [
			'        \'foundation/foundation\' : { deps: [\'jquery\'], exports: \'Foundation\' },',
			'        \'foundation/foundation.alerts\': { deps: [\'jquery\'], exports: \'Foundation.libs.alerts\' },',
			'        \'foundation/foundation.clearing\': { deps: [\'jquery\'], exports: \'Foundation.libs.clearing\' },',
			'        \'foundation/foundation.cookie\': { deps: [\'jquery\'], exports: \'Foundation.libs.cookie\' },',
			'        \'foundation/foundation.dropdown\': { deps: [\'jquery\'], exports: \'Foundation.libs.dropdown\' },',
			'        \'foundation/foundation.forms\': { deps: [\'jquery\'], exports: \'Foundation.libs.forms\' },',
			'        \'foundation/foundation.joyride\': { deps: [\'jquery\'], exports: \'Foundation.libs.joyride\' },',
			'        \'foundation/foundation.magellan\': { deps: [\'jquery\'], exports: \'Foundation.libs.magellan\' },',
			'        \'foundation/foundation.orbit\': { deps: [\'jquery\'], exports: \'Foundation.libs.orbit\' },',
			'        \'foundation/foundation.placeholder\': { deps: [\'jquery\'], exports: \'Foundation.libs.placeholder\' },',
			'        \'foundation/foundation.reveal\': { deps: [\'jquery\'], exports: \'Foundation.libs.reveal\' },',
			'        \'foundation/foundation.section\': { deps: [\'jquery\'], exports: \'Foundation.libs.section\' },',
			'        \'foundation/foundation.tooltips\': { deps: [\'jquery\'], exports: \'Foundation.libs.tooltips\' },',
			'        \'foundation/foundation.topbar\': { deps: [\'jquery\'], exports: \'Foundation.libs.topbar\' }'
		].join('\n');
	} else {
		templateLibraryShim = '';
		templateLibraryPath = '    },';
	}

	var requiredScriptsString = '[';
	for(var i = 0; i < requiredScripts.length; i++) {
		requiredScriptsString += '\''+requiredScripts[i]+'\'';
		if((i+1) < requiredScripts.length) {
			requiredScriptsString += ', ';
		}
	}
	requiredScriptsString += ']';

	this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', ['scripts/config.js','bower_components/requirejs/require.js'], {
		'data-main': 'scripts/main'
	});

	// add a basic config file, rest wiull be done by grunt bower task
	this.write('app/scripts/config.js',[
		'var require = {',
		'    paths: {',
		'		jquery: \'../bower_components/jquery/jquery\''+templateLibraryPath,
		'    shim: {',
		templateLibraryShim,
		'    }',
		'};'
	].join('\n'));

	// add a basic amd module
	this.write('app/scripts/app.js', [
		'/*global define */',
		'define(function (require) {',
		'    \'use strict\';\n',
		'    // load dependencies',
		'	 var $ = require(\'jquery\'),',
		'	     self = {};\n',
		'	 // API methods',
		'	 $.extend(self, {\n',
		'  	     /**',
		'	      * App initialization',
		'	      */',
		'		 init: function init() {',
		'		 	 log.debug(\'Running jQuery %s\', $().jquery);',
		'	     }',
		'	 });\n',
		'	 return self;',
		'});'
	].join('\n'));



	this.mainJsFile = [
		'require(' + requiredScriptsString + ', function (app, $) {',
		'    \'use strict\';',
		'    // use app here',
		'    console.log(app);',
		'    console.log(\'Running jQuery %s\', $().jquery);',
		'});'
	].join('\n');
};


FrontendGenerator.prototype.writeIndex = function writeIndex() {
	// prepare default content text
	var defaults = ['HTML5 Boilerplate'];

	var titleClass = '';

	if(this.frameworkSelected == 'pure') {
		titleClass = 'splash-head';
	}

	var contentText = [
		'                <h1 class=\''+titleClass+'\'>\'Allo, \'Allo!</h1>',
		'                <p>You now have</p>',
		'                <ul>'
	];




	if(this.frameworkSelected == 'bootstrap') {
		// Add Twitter Bootstrap scripts
		this.indexFile = this.appendStyles(this.indexFile, 'styles/vendor/bootstrap.css', [
			'bower_components/bootstrap/dist/bootstrap.css'
		]);

		defaults.push('Twitter Bootstrap 3');

	} else if(this.frameworkSelected == 'pure') {
		this.indexFile = this.appendStyles(this.indexFile, 'styles/vendor/pure.min.css', [
			'bower_components/pure/pure-min.css'
		]);
		defaults.push('PureCSS');
	} else if(this.frameworkSelected == 'foundation') {
		this.indexFile = this.appendStyles(this.indexFile, 'styles/vendor/foundation/stylesheets/foundation-min.css', [
			'bower_components/bower-foundation-css/foundation.min.css'
		]);
		defaults.push('Foundation');
	}

	defaults.push('RequireJS');


	// iterate over defaults and create content string
	defaults.forEach(function (el) {
		contentText.push('                    <li>' + el  +'</li>');
	});


	contentText = contentText.concat([
		'                </ul>',
		'                <p>installed.</p>',
		'                <h3>Enjoy coding! - Yeoman</h3>',
		''
	]);


	// append the default content
	contentText = contentText.join('\n');
	if(this.frameworkSelected == 'noframework') {
		contentText = '<div class="hero-unit">\n' + contentText+'</div>\n';
	}
	this.indexFile = this.indexFile.replace('<!--yeoman-welcome-->', contentText);
};

FrontendGenerator.prototype.app = function app() {
	this.mkdir('app');
	this.mkdir('app/scripts');
	this.mkdir('app/styles');
	this.mkdir('app/images');
	this.write('app/index.html', this.indexFile);
	this.write('app/scripts/main.js', this.mainJsFile);
};
