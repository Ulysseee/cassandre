import { Base } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SplitType from 'split-type';

export default class Paragraph extends Base {
    static config = {
        name: 'Paragraph',
        options: {
            delay: Number,
            opacity: Boolean,
        },
    };

    isVisible = false;

    mounted() {
        if (this.isVisible) return;
        this.isVisible = true;
        this.split();
        gsap.set(this.splitText.words, {
            yPercent: 100,
            opacity: this.$options.opacity ? 0 : 1,
        });
    }

    split () {
        this.$el.style.fontKerning = 'none';
        this.splitText = new SplitType(this.$el, {
            types: 'lines, words',
            tagName: 'span',
        });
    }

    animateIn () {
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
