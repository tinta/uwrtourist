var gulp = require('gulp');
var gp = require('gulp-load-plugins')();

function scssCompile (src, dest, options) {
    var stream = gulp.src(src)
        .pipe(gp.sourcemaps.init())
    // Compile scss
        .pipe(gp.sass(options))
    // Rename scss file
        .pipe(gp.rename('build.css'))
    // Write sourcemap
        .pipe(gp.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../scss'
        }))
    // Dump css build file
        .pipe(gulp.dest(dest));

    return stream;
}

module.exports = scssCompile;