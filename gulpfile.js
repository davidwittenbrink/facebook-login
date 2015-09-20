'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var babel = require('gulp-babel');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var del = require('del');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');


gulp.task('replacePolymerPath', function() {
  //the dist file is in a sub folder so we need to change the relative path.
  gulp.src('dist/facebook-login.html')
    .pipe(htmlreplace({
        'PolymerImport': '<link rel="import" href="../../polymer/polymer.html">'
    }))
    .pipe(gulp.dest('dist'));

});

gulp.task('crisper', function () {
  return gulp.src('facebook-login.html')
    .pipe(crisper())
    .pipe(gulp.dest('dist'));
});

gulp.task('babel', function () {
  return gulp.src('dist/facebook-login.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('vulcanize', function () {
  return gulp.src('dist/facebook-login.html')
    .pipe(vulcanize({
        abspath: '',
        excludes: ["../polymer/polymer.html"],
        stripExcludes: false,
        inlineScripts: true,
        inlineCss: true
  }))
    .pipe(gulp.dest('dist'));
});

gulp.task('cleanDistFolder', function () {
  return del([
    'dist/facebook-login.js',
  ]);
});

gulp.task('default', function(cb) {
  runSequence(
      'crisper',
      'replacePolymerPath',
      'babel',
      'vulcanize',
      'cleanDistFolder',
      cb);
});
