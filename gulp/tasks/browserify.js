var browserify = require('browserify');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var exorcist = require('exorcist');
var source = require('vinyl-source-stream');
var _ = require('lodash');

module.exports = function (gulp, config, $) {
	gulp.task('browserify', [ 'clean', 'lint' ], function () {
		var bundle = function () {
			return app.bundle()
				.on('error', config.base[ $.util.env.prod ? 'throwError' : 'logError' ])
				.pipe(exorcist(config.path.dist + '/js/app.js.map'))
				.pipe(source('app.js'))
				.pipe(gulp.dest(config.path.dist + '/js'))
				.pipe(browserSync.reload({ stream: true }));
		};

		var app = browserify(
			config.path.src + '/js/app.js',
			_.defaults(config.browserify, watchify.args)
		);

		app = watchify(app);
		app.on('update', bundle);

		return bundle();
	});
};
