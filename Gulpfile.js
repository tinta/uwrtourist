var gulp = require('gulp');
var tasks = require('./client/tasks');

var paths = {};

paths.resources = './client/resources/';

paths.build = paths.resources + 'build/';

paths.scss = {};
paths.scss.root = paths.resources + 'scss/';
paths.scss.src = [paths.scss.root + 'init.scss'];
paths.scss.watch = [paths.scss.root + '**/*.scss'];

paths.js = {};
paths.js.root = paths.resources + 'js/';
paths.js.build = 'build.js';
paths.js.watch = [paths.resources + 'js/**/*.js'];

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
    };
    return tasks.scssCompile(paths.scss.src, paths.build, options);
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
    'build',
    'watch',
]);

gulp.task('default', ['build']);

module.exports = gulp;