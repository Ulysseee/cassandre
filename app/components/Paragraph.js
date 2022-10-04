import { Base, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SplitType from 'split-type';

export default class Paragraph extends withIntersectionObserver(Base, {
    rootMargin: '0px 0px -25% 0px',
}) {
    static config = {
        name: 'Paragraph',
        options: {
            auto: {
                type: Boolean,
                default: true,
            },
            delay: Number,
            opacity: Boolean,
        },
    };

    splitText = null;
    hasBeenReveal = false;

    mounted() {
        if (this.hasBeenReveal) return;
        this.split();
        gsap.set(this.splitText.words, {
            yPercent: 100,
            opacity: this.$options.opacity ? 0 : 1,
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
            types: 'lines, words',
            tagName: 'span',
        });
    }

    revertSplit () {
        this.$el.style.fontKerning = '';
        this.splitText.revert();
    }

    animateIn () {
        this.hasBeenReveal = true;
        gsap.to(this.splitText.words, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            delay: this.$options.delay,
            ease: 'power3.out',
            clearProps: 'all',
        });
    }

    animateOut () {
        gsap.to(this.splitText.words, {
            yPercent: -100,
            duration: 0.3,
        });
    }
}
