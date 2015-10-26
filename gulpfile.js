var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

gulp.task('default', ['nodemon']);

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js'
    })
        .on('start', ['watch'])
        .on('change', ['watch'])
        .on('restart', function() {
            console.log('Restarted!');
        });
});

gulp.task('jshint', function() {
    return gulp.src(['app/**/*.js', 'public/**/*.js', 'server.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/*.js', 'public/**/*.js', 'server.js'] , ['jshint']);
});