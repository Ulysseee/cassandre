import { Base, withBreakpointObserver } from '@studiometa/js-toolkit';
import { addClass, getOffsetSizes, removeClass, toggleClass } from '@studiometa/js-toolkit/utils';
import { isTouchDevice } from '../utils/detector';

export default class Cursor extends withBreakpointObserver(Base) {
    static config = {
        name: 'Cursor',
        refs: ['inner'],
        log: true,
    };

    isOnLink = false;
    isOnSlider = false;
    isListening = true;
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

    mounted() {
        if (isTouchDevice()) this.$destroy();
    }

    moved ({ x, y, last, isDown, delta }) {
        toggleClass(this.$el, 'is-down', isDown);
        this.scroll.isActive = false;
        this.scroll.deltaY = 0;

        if (this.sticky.isActive) return;
        this.position = { x, y };
        this.setVariables({
            translateX: this.position.x,
            translateY: this.position.y,
            skewX: 0,
            skewY: 0,
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
            const stickyTarget = target.querySelector('[data-cursor-target]') ?? target;
            const targetBox = stickyTarget.getBoundingClientRect();
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
        if (!this.isListening) return;
        this.isOnLink = true;
        this.currentTarget.element = target;
        this.currentTarget.box = target.getBoundingClientRect();
        const { cursorColor, cursorSticky, cursorStickySide } = this.currentTarget.element.dataset;
        this.setColor(cursorColor);
        this.setSticky(target, cursorSticky, cursorStickySide);
        addClass(this.$el, 'on-link');
    }

    onLeaveLink ({ target }) {
        this.isOnLink = false;
        this.currentTarget.element = null;
        this.currentTarget.box = null;
        this.setSticky(target, false);
        removeClass(this.$el, 'on-link');
    }

    onEnterSlider ({ target }) {
        if (!this.isListening) return;
        this.isOnSlider = true;
        this.currentTarget.element = target;
        this.currentTarget.box = target.getBoundingClientRect();
        this.setColor(target);
        addClass(this.$el, 'on-slider');
    }

    onLeaveSlider ({ target }) {
        this.isOnSlider = false;
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

    disable() {
        this.isListening = false;
        this.onLeaveLink({ ...this.currentTarget.element });
        this.onLeaveSlider({ ...this.currentTarget.element });
    }

    enable() {
        this.isListening = true;
        if (this.isOnSlider) {
            this.setColor(target);
            addClass(this.$el, 'on-slider');
        }
        if (this.isOnLink) {
            const { cursorColor, cursorSticky, cursorStickySide } = this.currentTarget.element.dataset;
            this.setColor(cursorColor);
            this.setSticky(this.currentTarget.element, cursorSticky, cursorStickySide);
            addClass(this.$el, 'on-link');
        }
    }

    set isListening(value) {
        this.isListening = value;
    }
}
