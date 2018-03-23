import 'babel-polyfill';
import Base from './class/base.js';
import Timer from './class/timer.js';
import Calculate from './class/calculate.js';
import Interface from './class/interface.js';
import $ from 'jquery';

const copyProperties = (target, source) => {
    for (const key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        }
    }
};

const mix = (...mixins) => {
    class Mix {}
    for (const mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
};

class Lottery extends mix(Base, Calculate, Interface, Timer) {
    constructor(name = 'syy', cname = '11选5', issue = '**', state = '**') {
        super();
        this.name = name;
        this.cname = cname;
        this.issue = issue;
        this.state = state;
        this.el = '';
        this.omit = new Map();
        this.open_code = new Set();
        this.open_code_list = new Set();
        this.play_list = new Map();
        this.number = new Set();
        this.issue_el = '#curr_issue';
        this.countdown_el = '#countdown';
        this.state_el = '.state_el';
        this.cart_el = '.codelist';
        this.omit_el = '';
        this.cur_play = 'r5';
        this.initPlayList();
        this.initNumber();
        this.updateState();
        this.initEvent();
    }

    /**
     * [updateState 状态更新]
     * @return {[type]} [description]
     */
    updateState() {
        const self = this;
        this.getState().then(res => {
            self.issue = res.issue;
            self.end_time = res.end_time;
            self.state = res.state;
            $(self.issue_el).text(res.issue);
            self.countdown(res.end_time, time => $(self.countdown_el).html(time), () =>
                setTimeout(() => {
                    self.updateState();
                    self.getOmit(self.issue).then(res => {});
                    self.getOpenCode(self.issue).then(res => {});
                }, 500)
            );
        });
    }

    /**
     * [initEvent 初始化事件]
     * @return {[type]} [description]
     */
    initEvent() {
        $('#plays').on('click', 'li', this.changePlayNav.bind(this));
        $('.boll-list').on('click', '.btn-boll', this.toggleCodeActive.bind(this));
        $('#confirm_sel_code').on('click', this.addCode.bind(this));
        $('.dxjo').on('click', 'li', this.assistHandle.bind(this));
        $('.qkmethod').on('click', '.btn-middle', this.getRandomCode.bind(this));
    }
}

export default Lottery;
