import { Base, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SplitType from 'split-type';

export default class Title extends withIntersectionObserver(Base, {
    rootMargin: '0px 0px -25% 0px',
}) {
    static config = {
        name: 'Title',
        options: {
            auto: {
                type: Boolean,
                default: true,
            },
        },
    };

    splitText = null;
    hasBeenReveal = false;

    mounted() {
        if (this.hasBeenReveal) return;
        this.split();
        gsap.set(this.splitText.chars, {
            yPercent: 100,
        });
    }

    intersected([{ isIntersecting }]) {
        if (isIntersecting && this.$options.auto && !this.hasBeenReveal) {
            this.animateIn();
        }
    }

    split () {
        this.$el.style.fontKerning = 'none';
        this.splitText = new SplitType(this.$el, {
            types: 'words, chars',
            tagName: 'span',
        });
    }

    revertSplit () {
        this.$el.style.fontKerning = '';
        this.splitText.revert();
    }

    animateIn () {
        this.hasBeenReveal = true;
        gsap.fromTo(this.splitText.chars, {
            yPercent: 100,
        }, {
            yPercent: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.025,
        });
    }

    animateOut () {
        gsap.to(this.splitText.chars, {
            yPercent: -100,
            duration: 0.3,
        });
    }
}
