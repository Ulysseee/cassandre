import { Base, withFreezedOptions, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import { ANIMATIONS } from '../constants/animations';

export default class Image extends withFreezedOptions(withIntersectionObserver(Base, {
    rootMargin: ANIMATIONS.intersectionObserver.rootMargin,
})) {
    static config = {
        name: 'Image',
        options: {
            auto: {
                type: Boolean,
                default: true,
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
            this.animateIn();
        }
    }

    animateIn() {
        this.hasBeenReveal = true;
        gsap.fromTo(this.$el, {
            clipPath: this.$options.clipPath,
        }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'cubic.out',
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
