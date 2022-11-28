import { Base, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import { ANIMATIONS } from '../constants/animations';

export default class Divider extends withIntersectionObserver(Base, {
    rootMargin: ANIMATIONS.intersectionObserver.rootMargin,
}) {
    static config = {
        name: 'Divider',
        options: {
            direction: {
                type: String,
                default: 'horizontal',
            },
            delay: Number,
        },
    };

    animateInTriggered = false;

    mounted () {
        gsap.set(this.$el, {
            [(this.$options.direction === 'horizontal') ? 'scaleX' :  'scaleY']: 0,
            'transform-origin': this.$options.direction === 'horizontal' ? 'left' : 'top',
        });
    }

    intersected([{ isIntersecting }]) {
        if (isIntersecting && !this.animateInTriggered) {
            this.animateIn();
        }
    }

    animateIn () {
        this.animateInTriggered = true;
        gsap.to(this.$el, {
            [(this.$options.direction === 'horizontal') ? 'scaleX' :  'scaleY']: 1,
            duration: 1,
            delay: this.$options.delay,
            ease: 'cubic.inOut',
        });
    }
}
