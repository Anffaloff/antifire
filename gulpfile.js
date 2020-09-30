const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const gcmq = require('gulp-group-css-media-queries');

console.log(process.argv)
let isDev = process.argv.includes('--dev');
let isProd = !isDev;

function clean(){
	return del('./build/*');
}

function html(){
	return gulp.src('./src/**/*.html')
				.pipe(gulp.dest('./build'))
				.pipe(browserSync.stream());
}

function styles(){
	return gulp.src('./src/css/**/main.less')
				.pipe(gulpIf(isDev, sourcemaps.init()))
					// .pipe(concat('main.css'))
					.pipe(less())
					// .pipe(gcmq())
					// .pipe(autoprefixer())
					.pipe(gulpIf(isProd, cleanCSS({
						level: 1
					})))
				.pipe(gulpIf(isDev, sourcemaps.write()))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function images(){
	return gulp.src('./src/img/**/*')
				.pipe(gulp.dest('./build/img'));
}

function watch(){
	browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
	gulp.watch ('./src/css/**/*.less', styles);
	gulp.watch ('./src/**/*.html', html);
}

let build = gulp.parallel(html, styles, images);
let buildWithClean = gulp.series(clean, build);
let	dev = gulp.series(buildWithClean, watch);

gulp.task('build', buildWithClean);
gulp.task('clean', clean);
gulp.task('watch', dev);