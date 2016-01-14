var gulp = require('gulp');
var gp = require('gulp-load-plugins')();

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
    root: paths.resources + 'js/',
    build: 'build.js',
    watch: [paths.resources + 'js/**/*.js']
};

var logStd = function (data) {
    var message = data.toString();
    console.log(process.cwd());
    if (data) console.log(message);
};

var exec = function (command) {
    command = command.split(" ");
    var args = command.length > 1 ? command.slice(1, command.length) : [];
    var child = spawn(command[0], args, {stdio: "inherit"});
    console.log(args)
};

// Change dir to project root. All paths in `paths` should reflect this.
process.chdir(paths.projectRoot);

gulp.task('js:build', function () {
    process.chdir("./client");
    exec("./node_modules/.bin/browserifyinc --entry ./resources/js/router.js -v -o ./resources/build/index.js");
    process.chdir("./../");
});

gulp.task('js:lint', function() {
    return gp.eslint(paths.js.watch);
});

gulp.task('scss:compile', function() {
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
    gulp.watch(paths.scss.watch, ['scss:compile']);
});

gulp.task('build', [
    'scss:compile',
    // 'js:lint'
])

gulp.task('dev', [
    'server',
    'build',
    'watch'
]);

gulp.task('default', ['dev']);

module.exports = gulp;