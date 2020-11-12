const gulp = require('gulp');
const { argv } = require('yargs');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const tap = require('gulp-tap');
const jshint = require('gulp-jshint');
const pjson = require('./package.json');

gulp.task('list', (done) => {
	console.log('tasks');
	console.log('dist');
	console.log('test');
	done();
});

gulp.task('test', (done) => {
	gulp.src(pjson.myFiles)
		.pipe(concat('tmp.js'))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(tap(() => {
			console.log('finished');
			done();
		}));
});

gulp.task('dist', (done) => {
	gulp.src(pjson.myFiles)
		.pipe(concat(`all.${pjson.version}.js`))
		.pipe(gulp.dest('./dist/'))
		// .pipe(uglify())
		.pipe(rename(`all.min.${pjson.version}.js`))
		.pipe(gulp.dest('./dist/'))
		.pipe(tap(() => {
			console.log(`success : all.min.${pjson.version}.js`);
			done();
		}));
});
