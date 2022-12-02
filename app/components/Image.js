import { Base, withFreezedOptions, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import { ANIMATIONS } from '../constants/animations';
import CustomEase from 'gsap/CustomEase';

export default class Image extends withFreezedOptions(withIntersectionObserver(Base, {
    ...ANIMATIONS.intersectionObserver,
})) {
    static config = {
        name: 'Image',
        options: {
            auto: {
                type: Boolean,
                default: true,
            },
            delay: Number,
            duration: {
                type: Number,
                default: 1.2,
            },
            clipPath: {
                type: String,
                default: 'inset(100% 0% 0% 0%)',
            },
        },
    };

    hasBeenReveal = false;

    mounted() {
        if (this.hasBeenReveal) return;
        gsap.set(this.$el, {
            clipPath: this.$options.clipPath,
        });
    }

    intersected([{ isIntersecting }]) {
        if (isIntersecting && this.$options.auto && !this.hasBeenReveal) {
            this.hasBeenReveal = true
            this.animateIn();
        }
    }

    animateIn() {
        gsap.fromTo(this.$el, {
            clipPath: this.$options.clipPath,
        }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: this.$options.duration,
            delay: this.$options.delay,
            ease: CustomEase.create("custom", "M0,0 C0.046,0.498 0.077,0.805 0.226,0.904 0.356,0.99 0.504,1 1,1 "),
        });
    }

    animateOut() {
        gsap.fromTo(this.$el, {
            clipPath: 'inset(0% 0% 0% 0%)',
        }, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1,
            ease: 'cubic.out',
        });
    }
}
