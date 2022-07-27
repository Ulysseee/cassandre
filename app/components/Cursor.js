import { Base, withBreakpointObserver } from '@studiometa/js-toolkit';
import { addClass, clamp, getOffsetSizes, removeClass, toggleClass } from '@studiometa/js-toolkit/utils';

export default class Cursor extends withBreakpointObserver(Base) {
    static config = {
        name: 'Cursor',
        refs: ['inner'],
        log: true,
    };

    position = {
        x: 0,
        y: 0,
    };
    scroll = {
        isActive: false,
        deltaY: 0,
    };
    color = null;
    sticky = {
        isActive: false,
        side: null,
    };
    currentTarget = {
        element: null,
        box: null,
    };

    moved ({ x, y, last, isDown }) {
        toggleClass(this.$el, 'is-down', isDown);
        this.scroll.isActive = false;
        this.scroll.deltaY = 0;

        if (this.sticky.isActive) return;
        this.position = { x, y };
        this.setVariables({
            translateX: this.position.x,
            translateY: this.position.y,
            skewX: clamp(x - last.x, -10, 10),
            skewY: clamp(y - last.y, -10, 10),
        });
    }

    scrolled ({ delta }) {
        if (!this.currentTarget.element) return;

        this.scroll.isActive = true;
        this.scroll.deltaY += delta.y;

        if (this.position.y + this.scroll.deltaY < this.currentTarget.box.top || this.position.y + this.scroll.deltaY > this.currentTarget.box.bottom) {
            this.onLeaveLink({ ...this.currentTarget.element });
            this.onLeaveSlider({ ...this.currentTarget.element });
        } else if (this.sticky.isActive) {
            this.setSticky(this.currentTarget.element, true, this.sticky.side);
        }
    }

    setColor (newCursorColor) {
        if (!newCursorColor) {
            removeClass(this.$el, `is-${ this.color }`);
            this.color = null;
        } else if (newCursorColor !== this.color) {
            removeClass(this.$el, `is-${ this.color }`);
            this.color = newCursorColor;
            addClass(this.$el, `is-${ this.color }`);
        }
    }

    setSticky (target, isSticky, cursorStickySide = 'center') {
        if (isSticky === undefined || isSticky === false) {
            this.sticky.isActive = false;
        } else {
            this.sticky.isActive = true;
            this.sticky.side = cursorStickySide;
            const targetBox = this.currentTarget.element.getBoundingClientRect();
            console.log(this);
            const cursorBox = getOffsetSizes(this.$refs.inner);
            const offsetX = cursorStickySide === 'right'
                ? targetBox.width / 2 + cursorBox.width / 4
                : cursorStickySide === 'left'
                    ? - targetBox.width / 2
                    : 0;
            const translateX = targetBox.x + targetBox.width / 2 - cursorBox.width / 2 + offsetX;
            const translateY = targetBox.y + targetBox.height / 2 - cursorBox.height / 2 + 6;
            this.setVariables({ translateX, translateY, skewX: 0, skewY: 0, });
        }
    }

    onEnterLink ({ target }) {
        this.currentTarget.element = target;
        this.currentTarget.box = target.getBoundingClientRect();
        const { cursorColor, cursorSticky, cursorStickySide } = target.dataset;
        this.setColor(cursorColor);
        this.setSticky(target, cursorSticky, cursorStickySide);
        addClass(this.$el, 'on-link');
    }

    onLeaveLink ({ target }) {
        this.currentTarget.element = null;
        this.currentTarget.box = null;
        this.setSticky(target, false);
        removeClass(this.$el, 'on-link');
    }

    onEnterSlider ({ target }) {
        this.currentTarget.element = target;
        this.currentTarget.box = target.getBoundingClientRect();
        this.setColor(target);
        addClass(this.$el, 'on-slider');
    }

    onLeaveSlider ({ target }) {
        this.currentTarget.element = null;
        this.currentTarget.box = null;
        removeClass(this.$el, 'on-slider');
    }

    setVariables ({ translateX, translateY, skewX, skewY }) {
        this.$el.style.setProperty('--translateX', `${ translateX }px`);
        this.$el.style.setProperty('--translateY', `${ translateY }px`);
        this.$el.style.setProperty('--skewX', `${ skewX }deg`);
        this.$el.style.setProperty('--skewY', `${ skewY }deg`);
    }
}
