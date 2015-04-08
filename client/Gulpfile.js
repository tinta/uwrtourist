var gulp = require('gulp');
var tasks = require('./tasks');
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

paths.js = {};
paths.js.root = paths.resources + 'js/';
paths.js.build = 'build.js';
paths.js.watch = [paths.resources + 'js/**/*.js'];

// Change dir to project root. All paths in `paths` should reflect this.
process.chdir(paths.projectRoot);

gulp.task('js:lint', function() {
    var options = {
        "predef": [
            'window',
            'L'
        ]
    };
    return tasks.jsLint(paths.js.watch, options);
});

gulp.task('scss:compile', function() {
    var options = options || {
        outputStyle: 'compressed',
        errLogToConsole: true
    };
    return tasks.scssCompile(paths.scss.src, paths.build, options);
});

gulp.task('server', function() {
    var child = spawn('bin/runserver');
    child.stdout.on('data', logStd);
    child.stderr.on('data', logStd);

    function logStd (data) {
        var message = data.toString();
        if (data) console.log(message);
    }
});

gulp.task('watch', function() {
    gulp.watch(paths.js.watch, ['js:lint']);
    gulp.watch(paths.scss.watch, ['scss:compile']);
});

gulp.task('build', [
    'scss:compile',
    'js:lint',
])

gulp.task('dev', [
    'server',
    'build',
    'watch',
]);

gulp.task('default', ['dev']);

module.exports = gulp;