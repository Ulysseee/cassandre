import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';
import SVGReveal from './SVGReveal';
import SplitType from 'split-type';
import gsap from 'gsap';
import { easeInExpo } from '@studiometa/js-toolkit/utils';

export default class Footer extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'Footer',
        refs: [...AppEvents.config.refs, 'mask', 'wrapper', 'title'],
        components: {
            SVGReveal,
        },
    };

    titleReveal = false;
    wordsPerLine = null;

    mounted () {
        super.mounted();

        this.$refs.mask.style.clipPath = `polygon(${ this.getPolygonPath(0) })`;

        this.wordsPerLine = new SplitType(this.$refs.title, {
            type: 'lines',
        }).lines.map(line => [line.querySelectorAll('.word')]);
    }

    scrolledInView ({ current, start }) {
        const max = start.y + this.$el.offsetHeight;
        const progress = (current.y - start.y) / (max - start.y);

        this.$refs.mask.style.clipPath = `polygon(${ this.getPolygonPath(progress) })`;

        const translateY = - (1 - progress) * (this.$refs.wrapper.offsetHeight);
        this.$refs.wrapper.style.transform = `translate3d(0, ${ translateY }px, 0)`;

        for (const SVGReveal of this.$children.SVGReveal) {
            SVGReveal.progressDraw(1 - easeInExpo(progress));
        }

        if (!this.titleReveal && progress > 0.5) {
            this.titleReveal = true;
            this.wordsPerLine.forEach((wordsLine, index) => {
                gsap.from(wordsLine, {
                    yPercent: 100,
                    duration: 1,
                    ease: 'quint.out',
                    delay: 0.2 + index * 0.07,
                });
            });
        }
    }

    getPolygonPath (progress) {
        let clipPath = '100% 100%, 0% 100%, ';

        const widthSegments = Math.ceil(this.$refs.wrapper.offsetWidth / 40);
        const baseY = (1 - progress) * 100;
        const amplitude = (0.02 * this.$refs.wrapper.offsetWidth) * Math.sin(progress * Math.PI);

        clipPath += `0% ${ baseY }%, `;

        for (let index = 0; index <= widthSegments; index++) {
            const x = ((40 * index) / this.$refs.wrapper.offsetWidth) * 100;
            const y = baseY - Math.sin(((40 * index) / this.$refs.wrapper.offsetWidth) * Math.PI) * amplitude;

            clipPath += `${ x }% ${ y }%, `;
        }

        return clipPath.slice(0, -2);
    }
}
