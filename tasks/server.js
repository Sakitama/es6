import gulp from 'gulp';
import gls from 'gulp-live-server';
import args from './util/args';

gulp.task('server', cb => {
    if (!args.watch) return cb();
    let server = gls.new(['--harmony', 'server/bin/www']);
    server.start();
    gulp.watch(['server/public/**/*.js', 'server/public/**/*.css', 'server/views/**/*.ejs'], file => server.notify.apply(server, [file]));
    gulp.watch(['server/routes/**/*.js', 'server/app.js'], () => server.start.bind(server)());
});