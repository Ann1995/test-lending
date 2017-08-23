var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require("gulp-rename");


//  ---- Static server -----
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});
//
// ---- Pug complite ----

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});
//
// -----Sass complite ----
gulp.task('styles:compile', function() {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// --- Spritesmith ---
gulp.task('sprite', function(cb) {
    var spriteData = gulp.src('sourse/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});
// -----Delete-----
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
})

// ---Copy fonts -----//
gulp.task('copy:fonts', function() {
        return gulp.src('./source/fonts/**/*.*')
            .pipe(gulp.dest('build/fonts'));
    })
    // ---Copy images -----//
gulp.task('copy:images', function() {
        return gulp.src('./source/images/**/*.*')
            .pipe(gulp.dest('build/images'));
    })
    // ---Copy ---
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//----Watchers ---
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/template/**/*.scss', gulp.series('styles:compile'));
})

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
))