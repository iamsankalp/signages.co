'use strict';

import gulp from 'gulp';

// Utils -------------------------------
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';
import named from 'vinyl-named';
import rename from 'gulp-rename';
import notify from 'gulp-notify';

// Styles ------------------------------
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import willChange from 'postcss-will-change';
import vmin from 'postcss-vmin';
import mqpacker from 'css-mqpacker';
import cssnano from 'cssnano';

// Scripts -----------------------------
import webpackStream from 'webpack-stream';

// Images ------------------------------
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

// SVG ---------------------------------
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import cheerio from 'gulp-cheerio';

const config = {
  styles: {
    src: './resources/scss/',
    dist: './public/css/'
  },
  scripts: {
    src: './resources/js/',
    dist: './public/js/'
  },
  images: {
    src: './resources/images/',
    dist: './public/images/'
  },
  svg: {
    src: './resources/svg/',
    dist: './resources/views/partials/'
  },
};


gulp.task('styles', () => {

  const processors = [
    willChange(),
    vmin(),
    mqpacker(),
    cssnano(),
    autoprefixer({ browsers: ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10'] })
  ];

  return gulp.src([
    `${config.styles.src}**/*.scss`,
    '!**/_*/**' // Ignores Sass partials to `gulp.src` for better performance
  ])
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( newer(config.styles.dist) )
  .pipe( sass() )
  .pipe( postcss(processors) )
  .pipe( sourcemaps.write('./') )
  .pipe( gulp.dest(config.styles.dist) )
});




gulp.task('scripts', function() {
  return gulp.src('./resources/js/*.js')
  .pipe( named() )
  .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}) )
  .pipe( webpackStream( require('./webpack.dev.js') ))
  .on( 'error', notify.onError({ message: 'Error: <%= error.message %>'}) )
  .pipe( gulp.dest('./public/js/') )
  .pipe( notify({ message: 'Scripts task complete' }) );
})



gulp.task('images', function() {
  return gulp.src(config.images.src+'**/*.*')
  .pipe( newer(config.images.dist) )
  .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}) )
  .pipe( imagemin({
      progressive: true,
      use: [pngquant()]
  }) )
  .pipe( gulp.dest(config.images.dist) )
});


gulp.task('svg', function () {
  return gulp.src(config.svg.src+'**/*.svg')
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}) )
    .pipe( svgmin() )
    .pipe( svgstore({ fileName: 'icons.svg', inlineSvg: true}) )
    .pipe( cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }) )
    .pipe( rename({extname: '.njk'}) )
    .pipe( gulp.dest(config.svg.dist) )
});


gulp.task('watch', function() {
  gulp.watch(`${config.svg.src}**/*`, gulp.series('svg'));
  gulp.watch(`${config.images.src}**/*`, gulp.series('images'));
  gulp.watch(`${config.styles.src}**/*.scss`, gulp.series('styles'));
  gulp.watch(`${config.scripts.src}**/*.js`, gulp.series('scripts'));
});


gulp.task('compile',
  gulp.parallel('svg', 'styles', 'scripts', 'images')
);

gulp.task('go',
  gulp.parallel('compile', 'watch')
);