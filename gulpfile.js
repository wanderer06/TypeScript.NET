// List of all tasks by name and for reuse as dependencies.
const
	TASK_TYPESCRIPT         = 'typescript',
	TASK_TYPESCRIPT_MIN     = 'typescript.min',
	TASK_TYPESCRIPT_ES6     = 'typescript.es6',
	TASK_TYPEDOC            = 'typedoc',
	TASK_VERSION_BUMP_MINOR = 'version-bump-minor',
	TASK_VERSION_BUMP_PATCH = 'version-bump-patch',
	TASK_NUGET_PACK         = 'nuget-pack',
	TASK_DEFAULT            = 'default';

var gulp       = require('gulp'),
    del        = require('del'),
    rename     = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    typescript = require('gulp-typescript'),
    typedoc    = require('gulp-typedoc'),
    replace    = require('gulp-replace'),
    semver     = require('semver'),
    nugetpack  = require('gulp-nuget-pack');

const EVENT_END = 'end';
const DOCS = './documentation';


gulp.task(
	// This renders the same output as WebStorm's configuration.
	TASK_TYPESCRIPT, function()
	{

		var options = {
			tscPath: './node_modules/typescript/bin/tsc',
			outDir: './source',
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true,
			sourceMap: true
		};

		// In order to mirror WebStorm's compiler option, gulp-tsc is used.
		return gulp
			.src(['./source/**/*.ts'])
			.pipe(require('gulp-tsc')(options))
			.pipe(gulp.dest('./source'))
			;
	}
)
;

gulp.task(
	TASK_TYPESCRIPT_MIN, function()
	{
		del(['./min/**/*']);

		var typescriptOptions/*:typescript.Params*/ = {
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true
		};

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions/*:sourcemaps.WriteOptions*/ = {
			sourceRoot: function(file/*:VinylFile*/)/*:string*/
			{
				var count = (file.relative + '').split("\\").length;
				var result = '';
				for(var i = 1; i<count; i++)
				{
					result += '../';
				}
				return result + '../source/';
			},
			includeContent: false
		};

		var uglifyOptions = {
			preserveComments: 'license'
		};

		return gulp
			.src(['./source/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(uglify(uglifyOptions))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest('./min'));

	});

gulp.task(
	TASK_TYPESCRIPT_ES6, function()
	{
		del(['./es6/**/*']);

		var typescriptOptions/*:typescript.Params*/ = {
			noImplicitAny: true,
			target: 'es6',
			removeComments: true
		};

		return gulp
			.src(['./source/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./es6'));

	});


gulp.task(
	TASK_TYPEDOC, function(done)
	{
		var typedocOptions = {
			name: 'TypeScript.NET',
			out: './documentation',

			module: 'amd',
			target: 'es5',

//			excludeNotExported: true // Disable till fixed.
			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true
		};

		// Step 1: Render type-docs..
		console.log('TypeDocs: rendering');
		return gulp
			.src('source')
			.pipe(typedoc(typedocOptions))
			.on(EVENT_END, typedocFixes);


		function typedocFixes()
		{

			// Step 2-A: Fix for issue with search that places a [BACK-SLASH] instead of a [SLASH].
			console.log('TypeDocs: applying fixes');
			const SEARCH_FOLDER = DOCS + '/assets/js';
			gulp
				.src(SEARCH_FOLDER + '/search.js')
				.pipe(replace('\\\\', '/'))
				.pipe(replace('/_', '/'))
				.pipe(gulp.dest(SEARCH_FOLDER));

			// Step 2-B: Refactor (rewrite) html files.
			gulp.src(DOCS + '/**/*.html')
				.pipe(replace('/_', '/'))
				.pipe(replace(' href="_', ' href="'))
				.pipe(rename(function(path)
				{
					path.basename = path.basename.replace(/^_/, '');
				}))
				.pipe(gulp.dest(DOCS))
				.on(EVENT_END, cleanup);

		}

		function cleanup()
		{
			// Step 3: Delete all old underscored html files.
			del.sync(DOCS + '/**/_*.html', function()
			{
				console.log('TypeDocs: fixes complete');
				done();
			});
		}

	});

/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
function bumpVersion(type)
{
	// No tsd yet.
	var fs   = require('fs'),
	    bump = require('gulp-bump');

	var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	// increment version
	var newVer = semver.inc(pkg.version, type);

	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({ version: newVer }))
		.pipe(gulp.dest('./'));

}

gulp.task(TASK_VERSION_BUMP_PATCH, function() { bumpVersion('patch'); });

gulp.task(TASK_VERSION_BUMP_MINOR, function() { bumpVersion('minor'); });


gulp.task(TASK_NUGET_PACK,
	[
		TASK_TYPESCRIPT,
		TASK_TYPESCRIPT_MIN
	],
	function(callback) {

		var fs = require('fs');

		var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
		nugetpack({
				id: "TypeScript.NET.AMD",
				title: pkg.name,
				version: pkg.version,
				authors: "https://github.com/electricessence/",
				description: pkg.description,
				summary: "See http://electricessence.github.io/TypeScript.NET/ for details.",
				language: "en-us",
				projectUrl: "https://github.com/electricessence/TypeScript.NET",
				licenseUrl: "https://raw.githubusercontent.com/electricessence/TypeScript.NET/master/LICENSE.md",
				tags: "typescript tsc .NET TypeScript.NET LINQ",
				excludes: ["js/**/*.dev.js"],
				outputDir: ".nuget"
			},

			[
				'source',
				'min',
				'*.json',
				'*.md'
			],

			callback
		);
	});


gulp.task(TASK_DEFAULT, [
	TASK_TYPESCRIPT,
	TASK_TYPESCRIPT_MIN,
	TASK_TYPEDOC
]);