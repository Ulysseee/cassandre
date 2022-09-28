import { Base } from '@studiometa/js-toolkit';
import gsap from 'gsap';

export default class Paragraph extends Base {
    static config = {
        name: 'Paragraph',
        options: {
            delay: Number,
        },
    };

    animateIn () {
        gsap.fromTo(this.$el, {
            y: 12,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: this.$options.delay,
            ease: 'power3.out',
            clearProps: 'all',
        })
    }

    animateOut () {
        gsap.fromTo(this.$el, {
            y: 0,
            opacity: 1,
        }, {
            y: -12,
            opacity: 0,
            duration: 0.3,
            clearProps: 'all',
        })
    }
}
