import { Base } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SVGReveal from './SVGReveal';
import CustomEase from 'gsap/CustomEase';

export default class Navigation extends Base {
    static config = {
        name: 'Navigation',
        refs: ['logo', 'entries[]'],
        components: {
            SVGReveal,
        },
    };

    tweenIn = null;

    mounted() {
        [this.logo] = this.$children.SVGReveal;
        this.setAnim();
    }

    setAnim () {
        this.tweenIn = gsap.fromTo(this.$refs.entries, {
            opacity: 0,
            translateY: 18,
        }, {
            opacity: 1,
            translateY: 0,
            duration: 0.8,
            paused: true,
        });
        this.logo.hideShapes();
    }

    animateIn () {
        gsap.timeline()
            .add(this.tweenIn.play(0))
            .call(() => {
                this.logo.drawStrokes({
                    duration: 2.3,
                    ease: CustomEase.create("custom", "M0,0 C0.046,0.498 0.077,0.805 0.226,0.904 0.356,0.99 0.504,1 1,1 "),
                    delay: 0,
                });
            }, [], 0.1);
        // this.tweenIn.play(0);
    }
}
