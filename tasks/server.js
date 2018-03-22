import gulp from 'gulp';
import gls from 'gulp-live-server';
import args from './util/args';

gulp.task('server', cb => {
    if (!args.watch) return cb();
    let server = gls.new(['--harmony', 'server/bin/www']);
    server.start();
    gulp.watch(['server/public/javascripts/*.js', 'server/public/stylesheets/*.css', 'server/views/*.ejs'], function (file) {
        server.notify.apply(server, [file]);
    });
    gulp.watch(['server/routes/*.js', 'server/app.js'], function () {
        server.start.bind(server)();
    });
});