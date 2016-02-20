var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var bInc = require('browserify-incremental');
var source = require('vinyl-source-stream');
var exorcist = require("exorcist");
var uglifyify = require('uglifyify');
var browserify = require('browserify');

var spawn = require('child_process').spawn;

var paths = {};
paths.projectRoot = '../';
paths.resources = './client/resources/';
paths.build = paths.resources + 'build/';

paths.scss = {};
paths.scss.root = paths.resources + 'scss/';
paths.scss.src = [
    paths.scss.root + 'init.scss'
];
paths.scss.watch = [paths.scss.root + '**/*.scss'];

paths.js = {
    src: paths.resources + 'js/router.js',
    build: 'build.js',
    cache: './client/browserify-cache.json',
    watch: [paths.resources + 'js/**/*.js']
};

var logStd = function (data) {
    var message = data.toString();
    if (data) console.log(message);
};

var exec = function (command) {
    command = command.split(" ");
    var args = command.length > 1 ? command.slice(1, command.length) : [];
    var child = spawn(command[0], args, {stdio: "inherit"});
};

// Change dir to project root. All paths in `paths` should reflect this.
process.chdir(paths.projectRoot);

gulp.task('js:build', function () {
    var b = browserify({
        entries: paths.js.src,
        debug: true,
        // ignoreMissing: true,
        // b inc options
        cache: {}, packageCache: {}, fullPaths: true
    });

    return bInc(b, {cacheFile: paths.js.cache})
        .transform({ global: true, mangle: false }, uglifyify)
        .bundle()
        // Write sourcemap
        .pipe(exorcist(paths.build + 'build.js.map'))
        // Create stream for output file
        .pipe(source('build.js'))
        // Write output file
        .pipe(gulp.dest(paths.build));
});

gulp.task('js:lint', function() {
    return gp.eslint(paths.js.watch);
});

gulp.task('scss:build', function() {
    var stream = gulp.src(paths.scss.src);

    stream.pipe(gp.sourcemaps.init())
    // Compile scss
        .pipe(gp.sass({
            outputStyle: 'compressed',
            errLogToConsole: true
        }))
    // Rename scss file
        .pipe(gp.rename('build.css'))
    // Write sourcemap
        .pipe(gp.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../scss'
        }))
    // Dump css build file
        .pipe(gulp.dest(paths.build));

    return stream;
});

gulp.task('server', function() {
    exec('./bin/runserver');
});

gulp.task('watch', function() {
    gulp.watch(paths.js.watch, ['js:lint', 'js:build']);
    gulp.watch(paths.scss.watch, ['scss:build']);
});

gulp.task('build', [
    'scss:build',
    'js:build'
]);

gulp.task('dev', [
    'server',
    'build',
    'watch'
]);

gulp.task('default', ['dev']);

module.exports = gulp;