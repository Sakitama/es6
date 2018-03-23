class Timer {
    countdown(end, update, handle) {
        const now = new Date().getTime();
        if (now - end > 0) {
            handle.call(this);
        } else {
            const last_time = end - now;
            const px_d = 1000 * 60 * 60 * 24;
            const px_h = 1000 * 60 * 60;
            const px_m = 1000 * 60;
            const px_s = 1000;
            const d = Math.floor(last_time / px_d);
            const h = Math.floor((last_time - d * px_d) / px_h);
            const m = Math.floor((last_time - d * px_d - h * px_h) / px_m);
            const s = Math.floor((last_time - d * px_d - h * px_h - m * px_m) / px_s);
            const r = [];
            if (d > 0) {
                r.push(`<em>${d}</em>天`);
            }
            if (r.length || (h > 0)) {
                r.push(`<em>${h}</em>时`);
            }
            if (r.length || m > 0) {
                r.push(`<em>${m}</em>分`);
            }
            if (r.length || s > 0) {
                r.push(`<em>${s}</em>秒`);
            }
            this.last_time = r.join('');
            update.call(this, r.join(''));
            setTimeout(function () {
                this.countdown(end, update, handle);
            }.bind(this), 1000);
        }
    }
}

export default Timer;
