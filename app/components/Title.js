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
            repeat: {
                type: Boolean,
                default: false,
            }
        },
    };

    tweenIn = null;
    tweenOut = null;
    splitText = null;
    animateInTriggered = false;
    onAnimateInStart = null;
    onAnimateInComplete = null;

    mounted() {
        if (this.animateInTriggered && !this.$options.repeat) return;
        this.split();
        gsap.set(this.splitText.chars, {
            yPercent: 100,
        });
    }

    intersected([{ isIntersecting }]) {
        if (isIntersecting && this.$options.auto && (!this.animateInTriggered || this.$options.repeat)) {
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
        this.animateInTriggered = true;
        gsap.killTweensOf(this.splitText.chars);
        this.tweenIn = gsap.fromTo(this.splitText.chars, {
            yPercent: 100,
        }, {
            yPercent: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.018,
            onStart: this.onAnimateInStart,
            onComplete: this.onAnimateInComplete,
        });
    }

    animateOut () {
        this.animateInTriggered = false;
        gsap.killTweensOf(this.splitText.chars);
        this.tweenOut = gsap.to(this.splitText.chars, {
            yPercent: -100,
            duration: 0.3,
        });
    }
}
