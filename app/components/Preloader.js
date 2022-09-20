import { Base } from '@studiometa/js-toolkit';
import {
    addClass,
    easeOutQuint,
    removeClass,
} from '@studiometa/js-toolkit/utils';
import SVG from '../utils/Svg';
import { intervalPromise } from '../utils/intervalPromise';
import gsap from 'gsap';

export default class Preloader extends Base {
    static config = {
        name: 'Preloader',
        refs: ['wrapper', 'logoFrames[]', 'name', 'nameFigure', 'nameWord', 'overlay'],
        options: {
            name: {
                type: String,
                default: 'cassandre',
            },
        },
    };

    mounted () {
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
            await this.animateLogo({
                framesInterval: 50,
                loops: 0
            });

            addClass(this.$refs.logo, 'is-hidden');

            removeClass(this.$refs.name, 'is-hidden');

            new Promise(resolve => {
                setTimeout(() => {
                    SVG.drawShapes(this.nameShapes, {
                        reverse: true,
                        duration: 0.7,
                        easing: easeOutQuint,
                        onFinish: resolve,
                    });
                }, 300);
            })
            await this.animateName({
                lettersInterval: 30,
            });

            removeClass(this.$refs.overlay, 'is-hidden');
            resolve();
        });
    }

    async animateOut () {
        return gsap.timeline({
            onComplete: () => addClass(this.$el, 'is-hidden'),
        })
            .add(gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.animateOverlay,
                onUpdateParams: [this.overlay, this.overlay.height, '#FF6C3C'],
            }))
            .call(() => addClass(this.$refs.wrapper, 'is-hidden'))
            .add(gsap.to(this.overlay, {
                duration: 1,
                ease: 'expo.inOut',
                onUpdate: this.animateOverlay,
                onUpdateParams: [this.overlay, 0, '#FF6C3C'],
            }));
    }

    async animateName ({ lettersInterval }) {
        return intervalPromise(callsAmount => {
            this.$refs.nameWord.innerText = this.$options.name.slice(0, callsAmount);
        }, this.$options.name.length, lettersInterval);
    }

    async animateLogo({ framesInterval = 100, loops = 4 }) {
        return intervalPromise(callsAmount => {
            this.$refs.logoFrames.forEach((frame, index) => {
                setTimeout(() => {
                    removeClass(frame, 'is-hidden');
                    setTimeout(() => {
                        addClass(frame, 'is-hidden');
                    }, framesInterval);
                }, framesInterval * index + 1);
            });
        }, loops, framesInterval * this.$refs.logoFrames.length + 1);
    }

    animateOverlay (overlay, baseY, fillColor) {
        overlay.context.clearRect(0, 0, overlay.width, overlay.height);
        overlay.context.save();
        overlay.context.beginPath();

        overlay.context.moveTo(overlay.width, baseY);
        overlay.context.lineTo(0, baseY);

        const widthSegments = Math.ceil(overlay.width / 40);
        const t = (1 - this.ratio) * overlay.height;
        const amplitude = (window.innerWidth / 4) * Math.sin(this.ratio * Math.PI);

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
}
