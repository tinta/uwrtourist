var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var mapStream = require('map-stream');

function jsHintReporter (taskName) {
    var noErrors = true;
    var stream = mapStream(function (file, cb) {
        if (!file.jshint.success) {
            var message = 'JSHINT fail in ' + file.path;
            noErrors = false;
            console.log(message);

            file.jshint.results.forEach(function (err) {
                var filePathDirs = err.file.split('/');
                var filePath = filePathDirs.slice(
                    filePathDirs.length - 2,
                    filePathDirs.length
                ).join('/');

                if (err.error) {
                    var errorMessage = '' + filePath + ': line ' + err.error.line + ' | col ' + err.error.character + ' | ' + err.error.reason;
                    console.log(errorMessage);
                }
            });
        }

        cb(null, file);
    });

    if (noErrors) {
        var message = taskName + ': 0 jsHint issues!';
        console.log(message);
    }
    return stream;
};

function jsLint (src, options) {
    var reporter = new jsHintReporter('js:lint');
    var stream = gulp.src(src)
        // Lints JS
        .pipe(gp.jshint(options))
        .pipe(reporter);
    return stream;
};

module.exports = jsLint;