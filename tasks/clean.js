import gulp from 'gulp';
import del from 'del';

gulp.task('clean', () => del(['server/public/javascripts', 'server/public/stylesheets', 'server/views']));