import { Base } from '@studiometa/js-toolkit';
import gsap from 'gsap';
import SVG from '../utils/Svg';

export default class SVGReveal extends Base {
    static config = {
        name: 'SVGReveal',
        refs: ['svg'],
        log: true,
    };

    shapes = [];
    drawn = false;

    mounted () {
        if (this.drawn) return;
        this.shapes = SVG.getShapes(this.$refs.svg).map(shape => shape.el);
        this.hideShapes();
    }

    hideShapes () {
        gsap.set(this.shapes, {
            strokeDasharray: (i, target) => `${ target.getTotalLength() } ${ target.getTotalLength() }`,
            strokeDashoffset: (i, target) => `${ target.getTotalLength() }`,
        });
    }

    drawStrokes ({
                     duration = 1.3,
                     delay = 0.6,
                     ease = 'power3.out',
                 } = {
        duration: 1.3,
        delay: 0.6,
        ease: 'power3.out',
    }) {
        if (this.drawn) return;
        this.drawn = true;
        gsap.fromTo(this.shapes, {
            strokeDashoffset: (i, target) => `${ target.getTotalLength() }`,
        }, {
            strokeDashoffset: 0,
            duration,
            delay,
            ease,
            clearProps: 'all',
        });
    }

    progressDraw (progress) {
        gsap.set(this.shapes,{
            strokeDashoffset: (i, target) => `${ target.getTotalLength() * progress }`,
        });
    }
}
