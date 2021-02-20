/**
 * 下拉框组件
 *
 * @requires Jquery.js
 * @requires TreeBox2.js
 * @file "SelectTreeBox.css"
 * @file "SelectTreeBox.js"
 * @author Gping123 iguoping@qq.com
 * @date 2021/02/05
 */


class SelectTreeBox {

    /**
     * 选择器
     */
    selector = '';

    /**
     * TreeBox对象
     */
    treebox = undefined;

    /**
     * 已选择项集合
     */
    selected = new Set();

    /**
     * 主键名称
     */
    pkName = 'id';

    /**
     * 标题名称
     */
    titleName = 'name';

    // 一些类选择器名称
    _Class = 'select-tree-box';
    _ContainerClass = 'select-tree-box-container';
    _SelectClass = 'select-tree-box-selector';
    _TreeBoxClass = 'select-tree-box-treebox';

    /**
     * 构造方法
     *
     * @param {String} selector
     * @param {Array} data
     * @param {Array} selected
     * @param {String} dataType
     * @param {String} titleName
     * @param {String} pkName
     */
    constructor(selector, data, selected = [], dataType = 'parent_id', titleName = 'name', pkName = 'id') {

        this.selector = selector;

        this.titleName = titleName;

        this.pkName = pkName;

        this.selected = new Set(selected);

        this.render();

        let oldThis = this;

        // 回调函数
        let callFunc = function(val, seled) {
            oldThis.selectedEventHandle(val, seled, oldThis);
        };

        // 构建TreeBox对象
        this.treebox = new TreeBox(selector + ' .' + this._TreeBoxClass, data, selected, dataType, titleName, pkName, false, false, callFunc);

        // 监听事件
        this.listenEvent();

    }

    /**
     * 渲染方法
     */
    render() {

        let html = `
        <div class="${this._ContainerClass}">
            <div class="${this._SelectClass}">
                <div class="select-tree-box-labels"></div>
                <div class="selected-number-box"></div>
                <div class="ico">
                    <span class="ico_down"></span>
                </div>
            </div>
            <div class="${this._TreeBoxClass} hide"></div>
        </div>
        `;
        $(this.selector).addClass(this._Class).append(html);

    }

    /**
     * 监听所有事件
     */
    listenEvent() {
        this.listenClickEvent();

        this.listenCloseLableEvent();
    }

    /**
     * 点击事件监听
     *     点击显示，超出点击隐藏
     */
    listenClickEvent() {
        const oldThis = this;

        // 显示
        $(oldThis.selector).on('click', function(e) {
            let heigth = $(oldThis.selector).height();
            $('.'+oldThis._TreeBoxClass).addClass('hide');
            $(oldThis.selector + ' .' + oldThis._ContainerClass + ' .' + oldThis._TreeBoxClass).removeClass('hide').css({
                'margin-top': parseInt(heigth + 5) + 'px',
            });
            $(oldThis.selector + ' .ico > span').removeClass('ico_down').addClass('ico_up');
            e.stopPropagation();
        });

        // 隐藏
        $(document).on('click', function(e) {
            $(oldThis.selector + ' .' + oldThis._ContainerClass + ' .' + oldThis._TreeBoxClass).addClass('hide');
            $(oldThis.selector + ' .ico > span').removeClass('ico_up').addClass('ico_down');
        });
    }

    /**
     * 处理TreeBox2点击返回的事件
     *
     * @param {Object} val
     * @param {Set} seled
     */
    selectedEventHandle(val, seled, that) {

        let _selector = that.selector + ' .select-tree-box-labels';
        that.selected = seled;

        if (Array.from(seled).length == 0) {
            $(that.selector).attr('value', JSON.stringify([]));
            $(that.selector + ' .selected-number-box').html('');
            $(_selector).html('');
            return ;
        }

        seled = Array.from(seled);
        let seledNum = seled.length;

        $(that.selector).attr('value', JSON.stringify(seled));
        let key = seled.pop();
        let title = val[key];

        let html = `
        <span class="select-tree-box-label" value="${key}">
            ${title} <span class="select-tree-box-close" value="${key}" title="关闭">X</span>
        </span>
        `;

        $(that.selector + ' .selected-number-box').html('<span class="selected-number">' + seledNum + ' 已选</span>');
        $(_selector).html(html);

        that.listenCloseLableEvent();

    }

    /**
     * 监听关闭标签事件
     */
    listenCloseLableEvent() {
        const oldThis = this;
        $(this.selector + ' .select-tree-box-close').on('click', function (e) {

            let pk = $(this).attr('value');

            if (pk) {
                // 计算选择状态
                oldThis.treebox.setSelected(pk, false);
            }
        });
    }

}
