import $ from 'jquery';

class Base {
    /**
     * [initPlayList 初始化奖金和玩法及说明]
     * @return {[type]} [description]
     */
    initPlayList() {
        this.play_list
            .set('r2', {
                bonus: 6,
                tip: '从01～11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
                name: '任二'
            })
            .set('r3', {
                bonus: 19,
                tip: '从01～11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
                name: '任三'
            })
            .set('r4', {
                bonus: 78,
                tip: '从01～11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
                name: '任四'
            })
            .set('r5', {
                bonus: 540,
                tip: '从01～11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
                name: '任五'
            })
            .set('r6', {
                bonus: 90,
                tip: '从01～11中任选6个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">90</em>元',
                name: '任六'
            })
            .set('r7', {
                bonus: 26,
                tip: '从01～11中任选7个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">26</em>元',
                name: '任七'
            })
            .set('r8', {
                bonus: 9,
                tip: '从01～11中任选8个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">9</em>元',
                name: '任八'
            });
    }

    /**
     * [initNumber 初始化号码]
     * @return {[type]} [description]
     */
    initNumber() {
        for (let i = 1; i < 12; i++) {
            this.number.add(('' + i).padStart(2, '0'));
        }
    }

    /**
     * [setOmit 设置遗漏数据]
     * @param {[type]} omit [description]
     */
    setOmit(omit) {
        this.omit.clear();
        for (const [index, item] of omit.entries()) {
            this.omit.set(index, item)
        }
        $(this.omit_el).each(function (index, item) {
            $(item).text(this.omit.get(index));
        }.bind(this));
    }

    /**
     * [setOpenCode 设置开奖]
     * @param {[type]} code [description]
     */
    setOpenCode(code) {
        this.open_code.clear();
        for (const item of code.values()) {
            this.open_code.add(item);
        }
        this.updateOpenCode && this.updateOpenCode(code);
    }

    /**
     * [toggleCodeActive 号码选中取消]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    toggleCodeActive(e) {
        $(e.currentTarget).toggleClass('btn-boll-active');
        this.getCount();
    }

    /**
     * [changePlayNav 切换玩法]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    changePlayNav(e) {
        const $cur = $(e.currentTarget);
        $cur.addClass('active').siblings().removeClass('active');
        this.cur_play = $cur.attr('desc').toLocaleLowerCase();
        $('#zx_sm span').html(this.play_list.get(this.cur_play).tip);
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        this.getCount();
    }

    /**
     * [assistHandle 操作区]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    assistHandle(e) {
        e.preventDefault();
        const index = $(e.currentTarget).index();
        const btnBoll = $('.boll-list .btn-boll');
        btnBoll.removeClass('btn-boll-active');
        switch (index) {
            case 0:
                btnBoll.addClass('btn-boll-active');
                break;
            case 1:
                btnBoll.each((i, t) => {
                    if (t.textContent - 5 > 0) {
                        $(t).addClass('btn-boll-active');
                    }
                });
                break;
            case 2:
                btnBoll.each((i, t) => {
                    if (t.textContent - 6 < 0) {
                        $(t).addClass('btn-boll-active');
                    }
                });
                break;
            case 3:
                btnBoll.each((i, t) => {
                    if (t.textContent % 2 === 1) {
                        $(t).addClass('btn-boll-active');
                    }
                });
                break;
            case 4:
                btnBoll.each((i, t) => {
                    if (t.textContent % 2 === 0) {
                        $(t).addClass('btn-boll-active');
                    }
                });
                break;
            default:
                break;
        }
        this.getCount();
    }

    /**
     * [getName 获取当前彩票名称]
     * @return {[type]} [description]
     */
    getName() {
        return this.name;
    }

    /**
     * [addCode 添加号码]
     */
    addCode() {
        const $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
        const active = $active ? $active.length : 0;
        const count = this.computeCount(active, this.cur_play);
        if (count) {
            this.addCodeItem($active.join(' '), this.cur_play, this.play_list.get(this.cur_play).name, count);
        }
    }

    /**
     * [addCodeItem 添加单次号码]
     * @param {[type]} code     [description]
     * @param {[type]} type     [description]
     * @param {[type]} typeName [description]
     * @param {[type]} count    [description]
     */
    addCodeItem(code, type, typeName, count) {
        const tpl = `
            <li codes="${type}|${code}" bonus="${count * 2}" count="${count}">
                 <div class="code">
                     <b>${typeName}${count > 1 ? '复式' : '单式'}</b>
                     <b class="em">${code}</b>
                     [${count}注,<em class="code-list-money">${count * 2}</em>元]
                 </div>
             </li>
        `;
        $(this.cart_el).append(tpl);
        this.getTotal();
    }

    getCount() {
        const active = $('.boll-list .btn-boll-active').length;
        const count = this.computeCount(active, this.cur_play);
        const range = this.computeBonus(active, this.cur_play);
        const money = count * 2;
        const win1 = range[0] - money;
        const win2 = range[1] - money;
        let tpl;
        const c1 = (win1 < 0 && win2 < 0) ? Math.abs(win1) : win1;
        const c2 = (win1 < 0 && win2 < 0) ? Math.abs(win2) : win2;
        if (count === 0) {
            tpl = `您选了 <b class="red">${count}</b> 注，共 <b class="red">${count * 2}</b> 元`;
        } else if (range[0] === range[1]) {
            tpl = `您选了 <b>${count}</b> 注，共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
			<strong class="red">${range[0]}</strong> 元，
			您将${win1 >= 0 ? '盈利' : '亏损'}
			<strong class="${win1 >= 0 ? 'red' : 'green'}">${Math.abs(win1)} </strong> 元</em>`;
        } else {
            tpl = `您选了 <b>${count}</b> 注，共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
			<strong class="red">${range[0]}</strong> 至 <strong class="red">${range[1]}</strong> 元，
			您将${(win1 < 0 && win2 < 0) ? '亏损' : '盈利'}
			<strong class="${win1 >= 0 ? 'red' : 'green'}">${c1} </strong>
			至 <strong class="${win2 >= 0 ? 'red' : 'green'}"> ${c2} </strong>
			元</em>`;
        }
        $('.sel_info').html(tpl);
    }

    /**
     * [getTotal 计算所有金额]
     * @return {[type]} [description]
     */
    getTotal() {
        let count = 0;
        $('.codelist li').each((index, item) => count += $(item).attr('count') * 1);
        $('#count').text(count);
        $('#money').text(count * 2);
    }

    /**
     * [getRandom 生成随机数]
     * @param  {[type]} num [description]
     * @return {[type]}     [description]
     */
    getRandom(num) {
        const arr = [];
        let index;
        const number = Array.from(this.number);
        while (num--) {
            index = Number.parseInt(Math.random() * number.length);
            arr.push(number[index]);
            number.splice(index, 1);
        }
        return arr.join(' ');
    }

    /**
     * [getRandomCode 添加随机号码]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    getRandomCode(e) {
        e.preventDefault();
        const num = e.currentTarget.getAttribute('count');
        const play = this.cur_play.match(/\d+/g)[0];
        if (num === '0') {
            $(this.cart_el).html('');
        } else {
            for (let i = 0; i < num; i++) {
                this.addCodeItem(this.getRandom(play), this.cur_play, this.play_list.get(this.cur_play).name, 1);
            }
        }
    }
}

export default Base;
