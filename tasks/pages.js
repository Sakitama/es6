import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './util/args';

gulp.task('pages', () => gulp
    .src('app/views/*.ejs')
    .pipe(gulp.dest('server/views'))
    .pipe(gulpif(args.watch, livereload()))
);