'use strict';

import gulp from 'gulp';

// Utils -------------------------------
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';

// Styles ------------------------------
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import willChange from 'postcss-will-change';
import vmin from 'postcss-vmin';
import mqpacker from 'css-mqpacker';
import cssnano from 'cssnano';

const config = {
  styles: {
    src: './resources/scss/',
    dist: './public/css/'
  }
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
    '!**/_*/**' // Ignores Sass partials to `gulp.src` for best performance
  ])
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( newer(config.styles.dist) )
  .pipe( sass() )
  .pipe( postcss(processors) )
  .pipe( sourcemaps.write('./') )
  .pipe( gulp.dest(config.styles.dist) )
});



gulp.task('scripts', () => {

  const processors = [
    willChange(),
    vmin(),
    mqpacker(),
    cssnano(),
    autoprefixer({ browsers: ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10'] })
  ];

  return gulp.src([
    `${config.styles.src}**/*.scss`,
    '!**/_*/**' // Ignores Sass partials to `gulp.src` for best performance
  ])
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( newer(config.styles.dist) )
  .pipe( sass() )
  .pipe( postcss(processors) )
  .pipe( sourcemaps.write('./') )
  .pipe( gulp.dest(config.styles.dist) )
});



gulp.task('scripts', () => {
  glob('*.js', {cwd: config.scripts.src}, (err, files) => {
    
    if (err) {
      errorHandler(err);
    }

    const tasks = files.map(entry => {
      const b = browserify({
        entries: [entry],
        extensions: ['.js'],
        debug: true,
        cache: {},
        packageCache: {},
        basedir: config.scripts.src,
        transform: ['babelify']
      })

      const bundle = () => {
        return b.bundle()
          .on( 'error', errorHandler )
          .pipe( source(entry) )
          .pipe( buffer() )
          .pipe( sourcemaps.init({loadMaps: true}) )
          .pipe( uglify() )
          .pipe( sourcemaps.write('./') )
          .pipe( gulp.dest(config.scripts.dist) )
      };

      b.on('update', bundle);
      return bundle();
    });

    es.merge(tasks).on('end', done);

  });
});
