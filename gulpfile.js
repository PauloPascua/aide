var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

gulp.task('default', ['watch']);

// jshint
gulp.task('jshint', function() {
    return gulp.src('public/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch('public/**/*.js', ['jshint']);
});