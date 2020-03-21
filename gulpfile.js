var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var browserSync = require('browser-sync').create();
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvariables = require('postcss-css-variables'); 
var calc = require('postcss-calc');  
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var del = require('del')
var dist = {
    root: "dist/",
    html: "dist/",
    favicons: "dist/favicons",
    assets: "dist/assets"
}
var src = {
    favicons: "main/assets/favicons/*",
    html: "main/*.html"
}

// js file paths
var utilJsPath = 'main/assets/js'; // util.js path - you may need to update this if including the framework as external node module
var componentsJsPath = 'main/assets/js/components/*.js'; // component js files
var scriptsJsPath = 'main/assets/js'; //folder for final scripts.js/scripts.min.js files

// css file paths
var cssFolder = 'main/assets/css'; // folder for final style.css/style-custom-prop-fallbac.css files
var scssFilesPath = 'main/assets/css/**/*.scss'; // scss files to watch

function reload(done) {
  browserSync.reload();
  done();
}

function clean(done) {
    del.sync(dist.root);
    done();
}

function html() {
    return gulp.src(src.html)
      .pipe(gulp.dest(dist.html))
}

function favicons() {
    return gulp.src(src.favicons)
      .pipe(gulp.dest(dist.favicons))
}

gulp.task('sass', function() {
  return gulp.src(scssFilesPath)
  .pipe(sassGlob())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(cssFolder))
  .pipe(gulp.dest(dist.assets+'/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(rename('style-fallback.css'))
  .pipe(postcss([cssvariables(), calc()]))
  .pipe(gulp.dest(cssFolder))
  .pipe(gulp.dest(dist.assets+'/css'));
});

gulp.task('scripts', function() {
  return gulp.src([utilJsPath+'/util.js', componentsJsPath])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(gulp.dest(dist.assets+'/js'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(gulp.dest(dist.assets+'/js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('browserSync', gulp.series(function (done) {
  browserSync.init({
    server: {
      baseDir: 'main'
    },
    notify: false
  })
  done();
}));

gulp.task('watch', gulp.series(['browserSync', 'sass', 'scripts'], function () {
  gulp.watch('main/*.html', gulp.series(reload));
  gulp.watch('main/assets/css/**/*.scss', gulp.series(['sass']));
  gulp.watch(componentsJsPath, gulp.series(['scripts']));
}));

gulp.task('build', gulp.series(
    clean,
    html,
    favicons,
    ['sass', 'scripts'],
    function(done) {
        console.log('build success');
        done()
    }
));