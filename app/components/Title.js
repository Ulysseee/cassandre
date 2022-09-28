import { Base } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SplitType from 'split-type';

export default class Title extends Base {
    static config = {
        name: 'Title',
    };

    splitText = null;
    isVisible = false;

    mounted() {
        if (this.isVisible) return;
        this.isVisible = true;
        this.split();
        gsap.set(this.splitText.chars, {
            yPercent: 100,
        });
    }

    split () {
        this.$el.style.fontKerning = 'none';
        this.splitText = new SplitType(this.$el, {
            types: 'words, chars',
            tagName: 'span',
        });
    }

    revert () {
        this.$el.style.fontKerning = '';
        this.splitText.revert();
    }

    animateIn () {
        gsap.fromTo(this.splitText.chars, {
            yPercent: 100,
        }, {
            yPercent: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.025,
            onComplete: () => {
                this.revert();
            },
        });
    }

    animateOut () {
        this.split();
        gsap.to(this.splitText.chars, {
            yPercent: -100,
            duration: 0.3,
            onComplete: () => {
                this.revert();
            },
        });
    }
}
