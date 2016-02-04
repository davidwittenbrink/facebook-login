'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var babel = require('gulp-babel');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var del = require('del');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var path = require('path');
var historyApiFallback = require('connect-history-api-fallback');


var DIST = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

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
    .pipe(crisper({
        scriptInHead: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('babel', function () {
  return gulp.src('dist/facebook-login.js')
    .pipe(babel({
      presets: ['es2015']
    }))
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

// Remove all bower and node dependencies
gulp.task('cleanDependencies', function() {
  return del(['node_modules']);
});

// Build and serve the output from the dist build
gulp.task('serve', ['default'], function() {
  browserSync({
    port: 8080,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['demo'],
      middleware: [historyApiFallback()],
      routes: {
        '/dist': 'dist',
        '/webcomponentsjs': '../webcomponentsjs',
        '/polymer': '../polymer'
      }
    }
  });
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
