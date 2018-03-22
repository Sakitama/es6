import gulp from 'gulp';
import args from './util/args';

gulp.task('browser', cb => {
    if (!args.watch) return cb();
    gulp.watch('app/javascripts/**/*.js', ['scripts']);
    gulp.watch('app/views/*.ejs', ['pages']);
    gulp.watch('app/stylesheets/*.css', ['css']);
});