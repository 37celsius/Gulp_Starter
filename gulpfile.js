// ////////////////////////////////////////////////
// REQUIRED
// ///////////////////////////////////////////////

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload =  browserSync.reload;
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var del = require('del');
var uncss = require('gulp-uncss');
var minifyCss = require('gulp-minify-css');

// ////////////////////////////////////////////////
// PATHS
// ///////////////////////////////////////////////

var paths = {
	'bower': 'app/bower_components'
};

// ////////////////////////////////////////////////
// SCRIPT TASK
// ///////////////////////////////////////////////

gulp.task('scripts', function(){
	gulp.src([
			paths.bower + '/jquery/dist/jquery.js', 
			paths.bower + '/foundation/js/foundation.js',
			'app/raw_scripts/*.js'
			])
		.pipe(plumber())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));

	return gulp.src(paths.bower + '/modernizr/modernizr.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// SASS AND FOUNDATION _SETTING.SCSS TASK
// ///////////////////////////////////////////////

gulp.task('styles', function(){
	return gulp.src([
			'app/scss/style.scss'
		])
		.pipe(plumber())
		.pipe(sass({
			includePaths: [
				paths.bower + '/foundation/scss'
			]
		}))
		.pipe(concat('style.css'))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(uncss({
			html: ['app/*.html']
		}))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));

});

// ////////////////////////////////////////////////
// IMAGE TASK
// ///////////////////////////////////////////////
gulp.task('image', function(){
	gulp.src('img/*')
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('img'))
});

// ////////////////////////////////////////////////
// HTML TASK
// ///////////////////////////////////////////////

gulp.task('html', function(){
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// BUILD TASK
// ///////////////////////////////////////////////

// Clear out all files and folders from build folder
gulp.task('build:cleanFolder', function(cb){
	del([
		'build/**'
	], cb);
});

// Task to create build directory for all files
gulp.task('build:copy', ['build:cleanFolder'], function(){
	return gulp.src('app/**/*')
		.pipe(gulp.dest('build'));
});

// Task to remove unwanted build files
gulp.task('build:remove', ['build:copy'], function(cb){
	del([
		'build/scss',
		'build/raw_scripts',
		'build/bower_components'
	], cb);
});

gulp.task('build', ['build:copy', 'build:remove']);

// ////////////////////////////////////////////////
// BROWSERSYNC TASK
// ///////////////////////////////////////////////

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: "./app/"
		}
	});
});

// ////////////////////////////////////////////////
// WATCH
// ///////////////////////////////////////////////

gulp.task('watch', function(){
	gulp.watch('app/scripts/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('img/*', ['image']);
});

// ////////////////////////////////////////////////
// DEFAULT
// ///////////////////////////////////////////////

gulp.task('default', ['scripts', 'styles', 'image', 'html', 'browser-sync', 'watch']);



