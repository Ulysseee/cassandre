import { Base, withIntersectionObserver } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SplitType from 'split-type';
import { ANIMATIONS } from '../constants/animations';

export default class Paragraph extends withIntersectionObserver(Base, {
    ...ANIMATIONS.intersectionObserver,
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
            staggerLines: Boolean,
        },
    };

    splitText = null;
    wordsPerLine = null;
    animateInTriggered = false;

    mounted() {
        if (this.animateInTriggered) return;
        this.animateIn = this.animateIn.bind(this);
        this.setup();
    }

    setup () {
        this.split();
        gsap.set(this.splitText.words, {
            yPercent: 100,
            opacity: this.$options.opacity ? 0 : 1,
        });
    }

    intersected([{ isIntersecting }]) {
        if (isIntersecting && this.$options.auto && !this.animateInTriggered) {
            this.animateIn();
        }
    }

    split () {
        this.$el.style.fontKerning = 'none';
        this.splitText = new SplitType(this.$el, {
            types: 'lines, words',
            tagName: 'span',
        });
        this.wordsPerLine = this.splitText.lines.map(line => [line.querySelectorAll('.word')]);
    }

    revertSplit () {
        this.$el.style.fontKerning = '';
        this.splitText.revert();
    }

    animateIn () {
        this.animateInTriggered = true;
        this.wordsPerLine.forEach((wordsLine, index) => {
            gsap.to(wordsLine, {
                yPercent: 0,
                opacity: 1,
                duration: 1.3,
                ease: 'power3.out',
                delay: this.$options.delay + (this.$options.staggerLines ? index * 0.12 : 0),
            });
        });
    }

    animateOut () {
        this.wordsPerLine.forEach(wordsLine => {
            gsap.to(wordsLine, {
                yPercent: -100,
                duration: 0.3,
            });
        });
    }
}
