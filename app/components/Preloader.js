import { Base } from '@studiometa/js-toolkit';
import {
    addClass,
    easeInOutExpo,
    easeOutQuint,
    removeClass,
} from '@studiometa/js-toolkit/utils';
import SVG from '../utils/Svg';
import { intervalPromise } from '../utils/intervalPromise';
import gsap from 'gsap';

export default class Preloader extends Base {
    static config = {
        name: 'Preloader',
        refs: ['wrapper', 'logo', 'logoSvg', 'name', 'nameFigure', 'nameWord', 'splitName', 'overlay', 'overlayPath'],
        options: {
            name: {
                type: String,
                default: 'cassandre',
            },
        },
    };

    mounted () {
        this.logoShapes = SVG.getShapes(this.$refs.logoSvg);
        SVG.setInitialAttributesShapes(this.logoShapes);
        console.log(this.logoShapes);
        this.nameShapes = SVG.getShapes(this.$refs.nameFigure);
        SVG.setInitialAttributesShapes(this.nameShapes);

        this.overlay = {
            context: this.$refs.overlay.getContext('2d'),
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
        };
        this.$refs.overlay.width = this.overlay.width;
        this.$refs.overlay.height = this.overlay.height;
    }

    async animateIn () {
        return new Promise(async (resolve) => {
            await new Promise((resolve) => {
                SVG.drawShapes(this.logoShapes, {
                    reverse: true,
                    duration: 1.3,
                    easing: easeInOutExpo,
                    onFinish: resolve,
                });
            });
            await new Promise((resolve) => {
                SVG.drawShapes(this.logoShapes, {
                    reverse: true,
                    fromFullDrawn: true,
                    duration: 1.3,
                    easing: easeInOutExpo,
                    onFinish: resolve,
                });
            });

            addClass(this.$refs.logo, 'is-hidden');
            removeClass(this.$refs.name, 'is-hidden');

            await this.animateName({
                lettersInterval: 70,
            });
            await new Promise((resolve) => {
                SVG.drawShapes(this.nameShapes, {
                    reverse: true,
                    duration: 1.3,
                    easing: easeOutQuint,
                    onFinish: resolve,
                });
            });

            removeClass(this.$refs.overlay, 'is-hidden');
            await gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.overlayAnimate,
                onUpdateParams: [this.overlay, this.overlay.height, '#FF6C3C'],
            });

            addClass(this.$refs.name, 'is-hidden');
            removeClass(this.$refs.splitName, 'is-hidden');

            await gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.overlayAnimate,
                onUpdateParams: [this.overlay, 0, '#FF6C3C'],
            });

            resolve();
        });
    }

    overlayAnimate (overlay, baseY, fillColor) {
        overlay.context.clearRect(0, 0, overlay.width, overlay.height);
        overlay.context.save();
        overlay.context.beginPath();

        overlay.context.moveTo(overlay.width, baseY);
        overlay.context.lineTo(0, baseY);

        const widthSegments = Math.ceil(overlay.width / 40);
        const t = (1 - this.ratio) * overlay.height;
        const amplitude = 350 * Math.sin(this.ratio * Math.PI);

        overlay.context.lineTo(0, t);

        for (let index = 0; index <= widthSegments; index++) {
            const n = 40 * index;
            const r = t - Math.sin((n / overlay.width) * Math.PI) * amplitude;

            overlay.context.lineTo(n, r);
        }

        overlay.context.fillStyle = fillColor;
        overlay.context.fill();
        overlay.context.restore();
    }

    animateOut () {
        gsap.timeline({
            onComplete: () => addClass(this.$el, 'is-hidden'),
        })
            .add(gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.overlayAnimate,
                onUpdateParams: [this.overlay, this.overlay.height, '#DACAB5'],
            }))
            .call(() => addClass(this.$refs.wrapper, 'is-hidden'))
            .add(gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.overlayAnimate,
                onUpdateParams: [this.overlay, 0, '#DACAB5'],
            }));
    }

    async animateName ({ lettersInterval }) {
        return intervalPromise(callsAmount => {
            this.$refs.nameWord.innerText = this.$options.name.slice(0, callsAmount);
        }, this.$options.name.length, lettersInterval);
    }
}
